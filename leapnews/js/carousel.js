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
        planObj.name = 'img/' + arImgRotator[i];
        if (i == 10) {
            planObj.title = "Netflix, Comcast reach peering agreement - GigaOm report";
            planObj.gallery = ["img/netflix1.png", "img/netflix2.png", "img/netflix3.png",
                               "img/netflix4.png", "img/netflix5.png", "img/netflix6.png",
                               "img/netflix7.png", "img/netflix8.png"];
        } else {
            planObj.gallery = [];
        }
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

function visible_row() {
    var min_distance = Math.abs(parent[0].position.y - camera.position.y);
    var distance_i = 0;
    for (var i = 1; i < parent.length; i++) {
        var d = Math.abs(parent[i].position.y - camera.position.y);
        if (d < min_distance) {
            min_distance = d;
            distance_i = i;
        }
    }
    return distance_i;
}

function render() {
    distance_i = visible_row();
    parent[distance_i].rotation.y += (targetRotation - parent[distance_i].rotation.y) * 0.05;
    renderer.render(scene, camera);
}

function leapMain() {
    var frameCount = 3;
    var controller = new Leap.Controller({enableGestures: true});
    var x_threshold = 30, y_threshold = 60;
    var in_gallery = false;
    var y_arrow = false, x_arrow = false;
    controller.on('frame', function(frameInstance) {
        if (in_gallery) {
            for (var i = 0; i < frameInstance.gestures.length; i++) {
                if (frameInstance.gestures[i].type == "swipe") {
                    $.fancybox.close();
                    in_gallery = false;
                    break;
                } else if (frameInstance.gestures[i].type == "circle" && frameInstance.gestures[i].state == "stop") {
                    if (frameInstance.gestures[i].normal[2] <= 0)
                        $.fancybox.next();
                    else
                        $.fancybox.prev();
                }
            }
        } else if (frameInstance.hands.length > 0) {
            for (var i = 0; i < frameInstance.hands.length; i++) {
                if (frameInstance.hands[i].pointables.length == 1) {

                    // figure out which image i'm looking at
                    var min_distance = Infinity;
                    var best_i = visible_row(), best_j = 0;
                    var images = parent[best_i].children;
                    for (var j = 0; j < images.length; j++) {
                        var d = Math.abs((2 * Math.PI - parent[best_i].rotation.y % (2 * Math.PI)) - images[j].rotation.y);
                        if (parent[best_i].rotation.y < 0)
                            d = Math.abs((Math.abs(parent[best_i].rotation.y) % (2 * Math.PI)) - images[j].rotation.y);
                        if (d < min_distance) {
                            min_distance = d;
                            best_j = j;
                        }
                        if (frameCount % 250 == 1)
                            console.log(parent[best_i].rotation.y + " -- " + j + " -- " + images[j].rotation.y + " -- " + images[j].name);
                    }
                    if (frameCount % 250 == 1) {
                        console.log("bang! " + best_i + " " + best_j + " " + parent[best_i].children[best_j].name);
                        var l = [
                            {
                                href : parent[best_i].children[best_j].name,
                                title : parent[best_i].children[best_j].title
                            }
                        ];
                        var gallery = parent[best_i].children[best_j].gallery;
                        for (var x = 0; x < gallery.length; x++)
                            l.push({href: gallery[x]});
                        in_gallery = true;
                        $.fancybox.open(l, {padding : 0});
                    }
                    frameCount += 1;
                }

                // Looking for open hand preferably, not pointer index
                if (frameInstance.hands[i].pointables.length < 3)
                    continue;

                // X-axis - left/right
                var x_direction = frameInstance.hands[i].palmPosition[0];

                var ARROW_X_OFFSET = 375;
                var X_ARROW_SIZE = 50;
                var x_origin = false, x_terminus = false;

                var percentage = Math.abs(x_direction)/150;
                if (x_direction > x_threshold) {
                    targetRotation += 0.02 * percentage;

                    X_ARROW_SIZE *= percentage;
                    x_origin = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                                 camera.position.y,
                                                 0);
                    x_terminus = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET + X_ARROW_SIZE,
                                                   camera.position.y,
                                                   0);
                } else if (x_direction < -x_threshold) {
                    targetRotation -= 0.02 * percentage;

                    X_ARROW_SIZE *= percentage;
                    x_origin = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                                 camera.position.y,
                                                 0);
                    x_terminus = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET - X_ARROW_SIZE,
                                                   camera.position.y,
                                                   0);
                }

                if (x_arrow)
                    scene.remove(x_arrow);
                if (x_origin && x_terminus) {
                    var direction = new THREE.Vector3().subVectors(x_terminus, x_origin).normalize();
                    x_arrow = new THREE.ArrowHelper(direction, x_origin, X_ARROW_SIZE, 0xaa0000, 20, 20);
                    scene.add(x_arrow);
                }


                // Y-axis - up/down
                var origin = false, terminus = false;
                var y_direction = (frameInstance.hands[i].palmPosition[1]-175);
                var Y_ARROW_SIZE = 100;
                if (y_direction < -y_threshold) {
                    camera.position.y -= y_direction/150;
                    camera.position.y = Math.max(120, camera.position.y);
                    camera.position.y = Math.min(320, camera.position.y);

                    Y_ARROW_SIZE *= -y_direction/150;
                    origin = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                               camera.position.y,
                                               0);
                    terminus = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                                 camera.position.y - Y_ARROW_SIZE,
                                                 0);
                } else if (y_direction > y_threshold) {
                    camera.position.y -= y_direction/150;
                    camera.position.y = Math.max(120, camera.position.y);
                    camera.position.y = Math.min(320, camera.position.y);

                    Y_ARROW_SIZE *= y_direction/150;
                    origin = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                               camera.position.y,
                                               0);
                    terminus = new THREE.Vector3(camera.position.x - ARROW_X_OFFSET,
                                                 camera.position.y + Y_ARROW_SIZE,
                                                 0);
                }

                // adding arrow
                if (y_arrow)
                    scene.remove(y_arrow);
                if (origin && terminus) {
                    var direction = new THREE.Vector3().subVectors(terminus, origin).normalize();
                    y_arrow = new THREE.ArrowHelper(direction, origin, Y_ARROW_SIZE, 0xaa0000, 20, 20);
                    scene.add(y_arrow);
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
