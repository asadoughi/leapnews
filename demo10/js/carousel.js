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
var particle;
var particles = [];

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.color = '#ffffff';
    info.style.textAlign = 'center';

    info.innerHTML = 'Leap News Prototype';
    container.appendChild(info);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 10,  2500);
    camera.movementSpeed = 100.0;
    camera.rollSpeed = 0.5;
    camera.position.y = 60;
    camera.position.z = 500;

    scene = new THREE.Scene();
    parent = new THREE.Object3D();
    parent.position.y = 60;
    scene.add(parent);

    //////////////////////////////////////////////////////////////////////
    // lights
    //////////////////////////////////////////////////////////////////////
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(10, 10, 11);
    light.position.normalize();
    parent.add(light);

    var pointLight = new THREE.PointLight(0xffffff, 0.9);
    parent.add(pointLight);

    ////////////////////////////////////////////////////////////////////////
    // Generate 3D Planes in Radius circle
    ////////////////////////////////////////////////////////////////////////
    var materials = [];
    var arImgRotator = {
        "0": "0e1631c4c9fc11e1b10e123138105d6b_6.jpg",
        "1": "21ed7380c9fa11e18cf91231380fd29b_6.jpg",
        "2": "2c1d77c4cfcc11e1a15422000a1e8687_6.jpg",
        "3": "30d67d3cc9fb11e1be6a12313820455d_6.jpg",
        "4": "3b196304cb8b11e1bf341231380f8a12_6.jpg",
        "5": "3b2c7da4ca0011e1a94522000a1e8aaf_6.jpg",
        "6": "7370af62c9fd11e1b2fe1231380205bf_6.jpg",
        "7": "859ef4bac9fc11e19894123138140d8c_6.jpg",
        "8": "87518a80cfcd11e1a47b22000a1cf766_6.jpg",
        "9": "90cb31e4c9fe11e1bef722000a1e8bb5_6.jpg",
        "10": "930baf9cc9f911e19e4a12313813ffc0_6.jpg",
        "11": "9cfa1a94c9fd11e1a38422000a1c8933_6.jpg"
    };

    var camSize = 100;
    var startAngle = 0;
    var circleRadius = 230;
    var diameter = circleRadius * 4;
    var centerX = -5;
    var centerZ = 0.5; // -2.5

    var mpi = Math.PI / 180;
    var startRadians = startAngle + mpi;
    var totalSpheres = 12;
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
          particles.push(planObj);
          parent.add(planObj);
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

//////////////////////////////////////////////////////////////////////
//  onDocumentMouseWheel
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
    parent.rotation.y += ( targetRotation - parent.rotation.y ) * 0.05;
    renderer.render( scene, camera );
}

function leapMain() {
    var controller = new Leap.Controller({enableGestures: true});
    controller.on('frame', function(frameInstance) {
        if (frameInstance.gestures.length > 0) {
            for (var i = 0; i < frameInstance.gestures.length; i++) {
                if (frameInstance.gestures[i].type == "swipe") {
                    var x_direction = frameInstance.gestures[i].direction[0];
                    console.log("Swipe[" + i + "]: " + frameInstance.gestures[i]);
                    if (x_direction > 0) { // to right
                        targetRotation += 0.05 * frameInstance.gestures[i].speed / 1000.0;
                    } else { // to left
                        targetRotation -= 0.05 * frameInstance.gestures[i].speed / 1000.0;
                    }
                    camera.position.x =  Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
                    render();
                }
            }
        }
    });
    controller.connect();
}

init();
leapMain();
animate();
