/*global window */
/*global document */
/*global THREE */

var container;
var camera, scene, renderer, parent;
var targetRotation = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var theta = 45, phi = 60;

var y_arrow = false, x_arrow = false;
var lastFrameTime = 0;
var counter = 0, counter_max = 10;
function clearArrowIfNoRecentMovement() {
    // 3 frames, zero out the arrow
    if ((Date.now() - lastFrameTime) > 30) {
        if (y_arrow)
            scene.remove(y_arrow);
        if (x_arrow)
            scene.remove(x_arrow);
        render();
    }
}
setInterval(clearArrowIfNoRecentMovement,17); // 60 fps = 17 ms

function split_text(text, words)
{
    var split = text.split(" ");
    var i = 0;
    var length = split.length;
    var word_count = 0;
    var cur_page = 0;
    var pages = Array();
    pages[0] = Array();
    pages[0] += "<p class='page'>";
    while(i < length)
    {
        if(word_count < words)
        {
            pages[cur_page] += split[i] + " ";
            word_count++;
        }
        else
        {
            pages[cur_page] += "</p>";
            cur_page++;
            pages[cur_page] = Array();
            pages[cur_page] += "<p class='page'>";
            word_count = 0;
        }
        split[i];
        i++;
    }
    return pages;
}


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
var data = Object();

data[0] = Object();
data[0].type = "article"; 
data[0].url = "http://www.washingtonpost.com/blogs/the-switch/wp/2014/03/07/snowden-i-raised-nsa-concerns-internally-over-10-times-before-going-rogue/";
data[0].image_url = "http://www.washingtonpost.com/rf/image_606w/2010-2019/WashingtonPost/2013/06/23/Production/Daily/A-Section/Images/NSA_Surveillance_Snowden.JPEG-0ee14.jpg";
data[0].text = "Former National Security Agency contractor Edward Snowden said he repeatedly tried to go through official channels to raise concerns about government snooping programs but that his warnings fell on the deaf ears. In testimony to the European Parliament released Friday morning, Snowden wrote that he reported policy or legal issues related to spying programs to more than 10 officials, but as a contractor he had no legal avenue to pursue further whistleblowing. Asked specifically if he felt like he had exhausted all other avenues before deciding to leak classified information to the public, Snowden responded: Yes. I had reported these clearly problematic programs to more than ten distinct officials, none of whom took any action to address them. As an employee of a private company rather than a direct employee of the US government, I was not protected by US whistleblower laws, and I would not have been protected from retaliation and legal sanction for revealing classified information about lawbreaking in accordance with the recommended process. Snowden worked for the CIA before becoming an NSA contractor for various companies. He was working for Booz Allen Hamilton at an NSA facility in Hawaii at the time he leaked information about government programs to the press. In an August news conference, President Obama said there were 'other avenues' available to someone like Snowden 'whose conscience was stirred and thought that they needed to question government actions.'' Obama pointed to Presidential Policy Directive 19 -- which set up a system for questioning classified government actions under the Office of the Director of National Intelligence. However, as a contractor rather than an government employee or officer, Snowden was outside the protection of this system. 'The result,' Snowden said, 'was that individuals like me were left with no proper channels.' Elsewhere in his testimony, Snowden described the reaction he received when relating his concerns to co-workers and superiors. The responses, he said, fell into two camps. 'The first were well-meaning but hushed warnings not to 'rock the boat,' for fear of the sort of retaliation that befell former NSA whistleblowers like Wiebe, Binney, and Drake.' All three of those men, he notes, were subject to intense scrutiny and the threat of criminal prosecution. 'Everyone in the Intelligence Community is aware of what happens to people who report concerns about unlawful but authorized operations,' he said. The other responses, Snowden said, were similar: suggestions that he 'let the issue be someone else's problem.' Even the highest-ranking officials he told about his concerns could not recall when an official complaint resulted in the shutdown of an unlawful program, he testified, 'but there was a unanimous desire to avoid being associated with such a complaint in any form.' Snowden has claimed that he brought up issues with what he considers unlawful government programs before. The NSA disputes his account, previously telling The Washington Post that, 'after extensive investigation, including interviews with his former NSA supervisors and co-workers, we have not found any evidence to support Mr. Snowden’s contention that he brought these matters to anyone’s attention.' Both Obama and his national security adviser, Susan E. Rice, have said that Snowden should return to the United States and face criminal sanctions for his actions. Snowden was charged with three felonies over the summer and has been living in Russia since fleeing the United States in the wake of the leaks.";
data[0].description = "Snowden: I raised NSA concerns internally over 10 times before going rogue";
data[0].tags = "NSA, Security, Surveillance, Snowden"

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
                map: THREE.ImageUtils.loadTexture(data[0].image_url),
                doubleSided: false,
                wireframe: false,
                overdraw: true
            }));
        planObj.name = data[0].image_url
        planObj.title = data[0].description
        planObj.gallery = split_text(data[0].text, 50)

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

    container_tag_cloud = document.createElement('div');
    container.appendChild(container_tag_cloud);
    container_tag_cloud.innerHTML = "[This is where the tag cloud goes]";
    container_tag_cloud.setAttribute("style", "top:50%;left:80%;z-index:10;position:absolute");
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
    controller.on('frame', function(frameInstance) {
        lastFrameTime = Date.now();
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
                                title : parent[best_i].children[best_j].title,
                            }
                        ];
                        var gallery = parent[best_i].children[best_j].gallery;
                        for (var x = 0; x < gallery.length; x++)
                            l.push({content: gallery[x]});
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
