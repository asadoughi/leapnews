/*global window */
/*global document */
/*global THREE */

var container, stats;

var camera, scene, renderer, target, parent;
var texture_placeholder;
var mouseX = 0, mouseY = 0;
var text, plane;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var mouseX = 0;
var mouseXOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var radious = 1600, theta = 45, onMouseDownTheta = 45, phi = 60;
var onMouseDownPhi = 60, isShiftDown = false;

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    // var info = document.createElement('div');
    // info.style.position = 'absolute';
    // info.style.top = '10px';
    // info.style.width = '100%';
    // info.style.color = '#ffffff';
    // info.style.textAlign = 'center';
    // info.innerHTML = 'Leap News Prototype';
    // container.appendChild(info);

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
    for (var i = 0; i < parent.length; i++) {
        scene.add(parent[i]);

        // lights
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(10, 10, 11);
        light.position.normalize();
        parent[i].add(light);

        var pointLight = new THREE.PointLight(0xffffff, 0.9);
        parent[i].add(pointLight);
    }

    ////////////////////////////////////////////////////////////////////////
    // Generate 3D Planes in Radius circle
    ////////////////////////////////////////////////////////////////////////
    var materials = [];
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
    var centerX = -5;
    var centerZ = 0.5; // -2.5

    var mpi = Math.PI / 180;
    var startRadians = startAngle + mpi;
    var totalSpheres = 15;
    var incrementAngle = 360 / totalSpheres;
    var incrementRadians = incrementAngle * mpi;

    for (var i = 0; i < totalSpheres; i++) {
        var xp = centerX + Math.sin(startRadians) * circleRadius;
        var zp = centerZ + Math.cos(startRadians) * circleRadius;
        var planObj = new THREE.Mesh(
            new THREE.PlaneGeometry( camSize, .95*camSize),
            new THREE.MeshBasicMaterial( {
                map: THREE.ImageUtils.loadTexture( 'img/'+arImgRotator[i]),
                doubleSided: false,
                wireframe: false,
                overdraw: true
            }));
          planObj.position.x = xp;
          planObj.position.z = zp;
          planObj.rotation.y = i*incrementAngle * (Math.PI/180.0); //MH - do this without degrees
          startRadians += incrementRadians;
          parent[i%3].add(planObj);
    }

    //////////////////////////////////////////////////////////////////////
    //  Render
    //////////////////////////////////////////////////////////////////////
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColorHex(0x3399cc, 0.9);
    container.appendChild(renderer.domElement);

    //////////////////////////////////////////////////////////////////////
    //  addEventListener
    //////////////////////////////////////////////////////////////////////
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
}

//////////////////////////////////////////////////////////////////////
//  Mouse events
//////////////////////////////////////////////////////////////////////

function onDocumentMouseWheel( event ) {
    camera.position.x =  Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.position.y =  Math.sin( phi * Math.PI / 360 );
    camera.position.z =  Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.updateMatrix();
    render();
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( target );
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
    console.log("targetRotationOnMouseDown: " + targetRotationOnMouseDown);
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
    console.log("targetRotation: " + targetRotation);
    camera.position.x =  Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    render();
}

function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentTouchStart( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
    }
}

function onDocumentTouchMove( event ) {
    if ( event.touches.length == 1 ) {
        event.preventDefault();
        mouseX = event.touches[ 0 ].pageX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;
    }
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( target );
}

function animate() {
    requestAnimationFrame( animate );
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
    parent[distance_i].rotation.y += ( targetRotation - parent[distance_i].rotation.y ) * 0.05;
    renderer.render( scene, camera );
}

function leapMain() {
    var controller = new Leap.Controller();
    var x_threshold = 30, y_threshold = 100;
    controller.on('frame', function(frameInstance) {
        if (frameInstance.hands.length > 0) {
            for (var i = 0; i < frameInstance.hands.length; i++) {
                var x_direction = frameInstance.hands[i].palmPosition[0];
                // console.log("Hand[" + i + "]" + frameInstance.hands[i].palmVelocity[1]);
                var percentage = Math.abs(x_direction)/150;
                if (x_direction > x_threshold) { // to right
                    targetRotation += 0.02 * percentage;
                } else if (x_direction < -x_threshold) { // to left
                    targetRotation -= 0.02 * percentage;
                }
                camera.position.x =  Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

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
                render();
            }
        }
    });
    controller.connect();
}

init();
leapMain();
animate();
