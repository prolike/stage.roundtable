//#region UI 

// Options to be added to the GUI

/*

var options = {
    velx: 0,
    vely: 0,
    camera: {
        speed: 0.0000
    },
    stop: function () {
        this.velx = 0;
        this.vely = 0;
    },
    reset: function () {
        this.velx = 0.1;
        this.vely = 0.1;
        camera.position.z = 90;
        camera.position.x = 0;
        camera.position.y = 0;
        cube.scale.x = 1;
        cube.scale.y = 1;
        cube.scale.z = 1;
        cube.position.y = 0;
        cube.position.x = 0;
        cube.position.z = 0;
        cube.material.wireframe = true;
    }
};

// DAT.GUI Related Stuff

var gui = new dat.GUI();

var cam = gui.addFolder('Camera');
cam.add(options.camera, 'speed', 0, 0.000).listen();
cam.add(camera.position, 'y', 0, 100).listen();
cam.open();

var velocity = gui.addFolder('Velocity');
velocity.add(options, 'velx', -0.2, 0.2).name('X').listen();
velocity.add(options, 'vely', -0.2, 0.2).name('Y').listen();
velocity.open();

gui.add(cube.material, 'wireframe').listen();
gui.add(options, 'stop');
gui.add(options, 'reset');

*/

//#endregion UI

//#region scene

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(scene.position);
var renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
  
})

//document.addEventListener('mousedown', spin, false);

//#endregion scene

//#region circle

var circles = [];

var max = 0
for (let i = 0; i < max; i++) {
  setCircle()
}

function setCircle() {
  let c = new THREE.Mesh(new THREE.CircleBufferGeometry(0.25, 64), new THREE.MeshBasicMaterial({
    color: "white"
  }));
  scene.add(c);
  circles.push(c);
}

//#endregion circle

// scene.background = new THREE.CubeTextureLoader()
// 					.setPath( 'assets/HDRI/' )
// 					.load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );

//#region Lights


var point = new THREE.PointLight ( 0xffffff, 10, 100 );
point.position.set( 50, 50, 25 );
scene.add( point );

 var AmbientLight = new THREE.AmbientLight(0xffffff, 1);
 scene.add(AmbientLight);

//#endregion Lights

//#region bottle

var bottle;

var loader = new THREE.GLTFLoader();

loader.load('3Dassets/bottle/bottle.glb', function (gltf) {

  scene.add(gltf.scene);
  bottle = gltf.scene;
  
  var size = 10;

  bottle.scale.set(size,size,size)
});

var spins = 0;
var peoples = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
var peopleMap = {}

function prepare() {
  i = 0
  for (ppl of peoples) {
    var position = 360 / peoples.length
    var angle = position * i
    peopleMap[ppl] = angle
    i++
  }
}
prepare()

function getDegree() {
  let items = Array.from(Object.keys(peopleMap));
  var key = items[Math.floor(Math.random() * items.length)];
  var degree = peopleMap[key]
  //console.log(key)
  delete peopleMap[key]
  //console.log(degree)
  return degree
}

document.onkeydown = function(spin) {
  spin.preventDefault();
  if (spin.keyCode == 34) {
    var degree = getDegree() //Get the next degree
    var radian = degree * Math.PI / 180 //Convert the degree to radian
    //bottle.rotation.z = radian;
    console.log(radian)
  
    var tl = new TimelineMax()
  
    tl.to(bottle.rotation, .5, {z: bottle.rotation.z - .5, ease: "power2.out"})
    tl.to(bottle.rotation,  1, {z: 20, ease: "power2.out"})
    tl.to(bottle.rotation,  1, {z: radian, ease: "power4.out"});
  }
}


// function spin() { //OnClick should call this function and pass meshObject as parameter. 

//   var degree = getDegree() //Get the next degree
//   var radian = degree * Math.PI / 180 //Convert the degree to radian
//   //bottle.rotation.z = radian;
//   console.log(radian)

//   var tl = new TimelineMax()

//   tl.to(bottle.rotation, .5, {z: bottle.rotation.z - .5, ease: "power2.out"})
//   tl.to(bottle.rotation,  1, {z: 20, ease: "power2.out"})
//   tl.to(bottle.rotation,  1, {z: radian, ease: "power4.out"});
//  }





//#endregion bottle

var clock = new THREE.Clock();
var time = 0;
var radius = 3.28;


renderer.setAnimationLoop(() => {
 // time = clock.getElapsedTime() * 0 * Math.PI;
  circles.forEach((c, ndx) => {
    console.log(ndx)
    var x = Math.cos(Math.PI * 2 / max * ndx) * radius
    var y = Math.sin(Math.PI * 2 / max * ndx) * radius
    var z = 0
    c.position.set(x,y,0)
  })

  renderer.render(scene, camera)
});