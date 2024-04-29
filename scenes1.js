const CHELSEA_MUNI_ID = '57';

const scenes = [
    { 
        name: "Scene 1", 
        content: "Zoning laws determine not only the landscape of our communities but also the resources that schools can access. Areas with restrictive zoning often show disparities in school funding and student performance. How does your municipality compare?",
        additionalInfo: "",
        zoom: 9, 
        center: [-71.0589, 42.3601], 
        clickable: false 
    },
    { 
        name: "Scene 2", 
        content: "Detailed view of Chelsea: Restrictive zoning limits educational opportunities.",
        additionalInfo: "In this scene, you'll explore the impact of restrictive zoning on educational opportunities in Chelsea. Learn about the challenges and opportunities for education in this municipality.",
        zoom: 13, 
        center: [-71.0105, 42.3907], 
        clickable: false 
    },
    { 
        name: "Scene 3", 
        content: "Observing Cambridge and Brookline: Seeing the benefits of progressive zoning reforms on local schools.",
        additionalInfo: "This scene highlights the benefits of progressive zoning reforms on local schools in Somerville.",
        zoom: 12.5, 
        center: [-71.0935, 42.3607], 
        clickable: false 
    },
    { 
        name: "Map View", 
        content: "Dive Deeper: Click on Any Municipality",
        additionalInfo: "This interactive map allows you to explore the zoning impact on education in Greater Boston municipalities. Click on a municipality to delve deeper into specific data and comparisons.",
        zoom: 9, 
        center: [-71.0589, 42.3601], 
        clickable: true 
    }
];

let currentSceneIndex = 0;
let highlightedMunicipality = null;

function selectChelsea() {
    console.log("Attempting to select Chelsea...");
    if (!map.loaded()) {
        console.log("Map is not fully loaded. Exiting...");
        return; // Exit if the map isn't ready
    }
    console.log("Map is loaded. Continuing to select Chelsea...");
    const municipalityName = 'Chelsea';
    const municipalityId = CHELSEA_MUNI_ID;
    document.getElementById("municipality-name").innerText = `Municipality: ${municipalityName}`;
    map.setFilter("municipalities-highlighted", ["==", ["get", "muni_id"], municipalityId]);
    map.flyTo({center: [-71.0105, 42.3907], zoom: 13});
}




function updateScene() {
    const scene = scenes[currentSceneIndex];
    document.getElementById("municipality-name").innerText = scene.content;
    document.getElementById("additional-info").innerHTML = scene.additionalInfo;
    document.getElementById("next-scene").style.visibility = currentSceneIndex < scenes.length - 1 ? "visible" : "hidden";
    document.getElementById("previous-scene").style.visibility = currentSceneIndex > 0 ? "visible" : "hidden";
    if (!scene.clickable) {
        disableMapClick();
    } else {
        enableMapClick();
    }
    zoomToScene(scene);
    if (scene.name === "Scene 2") {
        selectChelsea();
    }
}

function goToNextScene() {
    if (currentSceneIndex < scenes.length - 1) {
        currentSceneIndex++;
        updateScene();
    }
}

function goToPreviousScene() {
    if (currentSceneIndex > 0) {
        currentSceneIndex--;
        updateScene();
    }
}

function zoomToScene(scene) {
    map.flyTo({
        center: scene.center,
        zoom: scene.zoom,
        essential: true
    });
}

function enableMapClick() {
    map.on("click", handleClick);
}

function disableMapClick() {
    map.off("click", handleClick);
}

function handleClick(e) {
    const bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
    ];
    const selectedFeatures = map.queryRenderedFeatures(bbox, {
        layers: ["municipalities-layer"]
    });
    if (selectedFeatures.length > 0) {
        const municipalityName = selectedFeatures[0].properties.municipal;
        document.getElementById("municipality-name").innerText = `Municipality: ${municipalityName}`;
        highlightedMunicipality = selectedFeatures[0].properties.muni_id;
    } else {
        console.warn("No features found at click point:", e.point);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    updateScene();
});

updateScene();
