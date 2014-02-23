/*global window */
/*global document */
/*global THREE */

var container;
var camera, scene, renderer, parent;
var targetRotation = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var theta = 45, phi = 60;

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 10,  2500);
    camera.movementSpeed = 100.0;
    camera.rollSpeed = 0.5;
    camera.position.y = 220;
    camera.position.z = 500;

    scene = new THREE.Scene();
    parent = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];
    parent[0].position.y = 320;
    parent[1].position.y = 220;
    parent[2].position.y = 120;
    for (var i = 0; i < parent.length; i++)
         scene.add(parent[i]);

    ////////////////////////////////////////////////////////////////////////
    // Generate 3D Planes in Radius circle
    ////////////////////////////////////////////////////////////////////////
    var arImgRotator = {
        "0": "0342f0984c40b47f86b077ed304b.jpg",
        "1": "04432755468e82b71776d68c38ce.jpg",
        "2": "1643c2644bebb198f4469725c095.jpg",
        "3": "17e2599d4a38a5a39345112fe906.jpg",
        "4": "1ce8af5e40bdaffce28d41085e0f.jpg",
        "5": "240b025d4fdb91cb486440b95008.jpg",
        "6": "50ec75624b16be2b7396e397a105.jpg",
        "7": "5a9ee59c48d6992a13ba8f380202.jpg",
        "8": "6a39fe1a4b06850414edbec28f34.jpg",
        "9": "912b446a4e94a2643895f73d80a3.jpg",
        "10": "a5855dcb4a33a78cc8b49dfcdbd7.jpg",
        "11": "dcb19d924a1eb644cc7b03637802.jpg",
        "12": "dd1d81eb464a9e7e9eb102674cf0.jpg",
        "13": "dec7ee9f473bb0423eebf38bd279.jpg",
        "14": "eb74f23941f2b39acd8b9322cee9.jpg"
    };

    var camSize = 100;
    var startAngle = 0;
    var circleRadius = 230;

    var mpi = Math.PI / 180;
    var startRadians = startAngle * mpi;
    var totalSpheres = 15;
    var incrementAngle = 360 / totalSpheres;
    var incrementRadians = incrementAngle * mpi;

    for (var i = 0; i < totalSpheres; i++) {
        var xp = Math.sin(startRadians) * circleRadius;
        var zp = Math.cos(startRadians) * circleRadius;
        var planObj = new THREE.Mesh(
            new THREE.PlaneGeometry(camSize, 0.95*camSize),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('img/' + arImgRotator[i]),
                doubleSided: false,
                wireframe: false,
                overdraw: true
            }));
          planObj.position.x = xp;
          planObj.position.z = zp;
          planObj.rotation.y = i * incrementAngle * mpi;
          startRadians += incrementRadians;
          parent[i%3].add(planObj);
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColorHex(0xF8F8F8, 0.9);
    container.appendChild(renderer.domElement);
}


function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    var min_distance = Math.abs(parent[0].position.y - camera.position.y);
    var distance_i = 0;
    for (var i = 1; i < parent.length; i++) {
        var d = Math.abs(parent[i].position.y - camera.position.y);
        if (d < min_distance) {
            min_distance = d;
            distance_i = i;
        }
    }
    parent[distance_i].rotation.y += (targetRotation - parent[distance_i].rotation.y) * 0.05;
    renderer.render(scene, camera);
}

function leapMain() {
    var controller = new Leap.Controller();
    var x_threshold = 30, y_threshold = 100;
    controller.on('frame', function(frameInstance) {
        if (frameInstance.hands.length > 0) {
            for (var i = 0; i < frameInstance.hands.length; i++) {
                if (frameInstance.hands[i].pointables.length == 1) {
                    // figure out which image i'm looking at
                    console.log("bang!");
                }

                // Looking for open hand preferably, not pointer index
                if (frameInstance.hands[i].pointables.length < 3)
                    continue;

                // X-axis - left/right
                var x_direction = frameInstance.hands[i].palmPosition[0];
                var percentage = Math.abs(x_direction)/150;
                if (x_direction > x_threshold) {
                    targetRotation += 0.02 * percentage;
                } else if (x_direction < -x_threshold) {
                    targetRotation -= 0.02 * percentage;
                }
                camera.position.x =  Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);

                // Y-axis - up/down
                var y_direction = (frameInstance.hands[i].palmPosition[1]-140);
                if (y_direction < y_threshold) {
                    camera.position.y -= y_direction/150;
                    camera.position.y = Math.max(120, camera.position.y);
                    camera.position.y = Math.min(320, camera.position.y);
                } else if (y_direction > y_threshold) {
                    camera.position.y -= y_direction/150;
                    camera.position.y = Math.max(120, camera.position.y);
                    camera.position.y = Math.min(320, camera.position.y);
                }

                // Z-axis - zoom
                // camera.fov *= (1 + frameInstance.hands[i].palmPosition[2]/50000);
                // camera.updateProjectionMatrix();

                render();
            }
        }
    });
    controller.connect();
}

init();
leapMain();
animate();
