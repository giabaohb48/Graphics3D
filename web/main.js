
let scene, camera;
var renderer, cube, plane, orbit, gui, controls;
var object, material, mesh, pointLight;
var light;

var geoms = [new THREE.BoxGeometry(1, 1, 1), new THREE.SphereGeometry(1, 32, 32), new THREE.ConeGeometry( 1, 2, 32 ),
        new THREE.CylinderGeometry( 1, 1, 2, 32), new THREE.TorusGeometry( 1, 0.4, 64, 100), 
        new THREE.TorusKnotGeometry( 1, 0.4, 100, 16), new THREE.TetrahedronGeometry(1, 0) , new THREE.OctahedronGeometry(1, 0),
        new THREE.IcosahedronGeometry(1, 0), new THREE.TeapotGeometry( 1, 5, true, true, true, true, true )];

var mats = [new THREE.PointsMaterial({color: 'white',size: 0.03}), 
        new THREE.LineBasicMaterial( { color: 0xaaaaaa, linewidth:10,transparent: true, opacity: 10 }),
        new THREE.MeshLambertMaterial({color: 0xffffff})]


function init() {
    // SCENE
    scene = new THREE.Scene()
    grid = new THREE.GridHelper(200, 100, 0x888888, 0x444444);

    scene.add(grid)
    gui = new dat.GUI({});

    // LIGHT
    var ambieantLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambieantLight);

    var directLight = new THREE.DirectionalLight( 0xffffff, 0.5, 100 );
    directLight.position.set( 0, 10 , 0 ); //default; light shining from top
    directLight.castShadow = true; // default false
    scene.add( directLight );

    var enableFog = false;
    if (enableFog)
    {
        scene.fog = new THREE.FogExp2(0xffffff,0.2);
    }
    
    // CAMERA
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    // RENDERER
    renderer = new THREE.WebGLRenderer({antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // CONTROL
    orbit = new THREE.OrbitControls( camera, renderer.domElement );
    orbit.rotateSpeed = 1;
    orbit.enableDamping = true;
    orbit.dampingFactor = .05;

  
    // const texture = new THREE.TextureLoader().load('./assets/texture/galaxy.jpg')
    // scene.add(plane);

    // plane.position.y = -0.6;
    // cube.rotation.x = 90;
    camera.position.z = 5;
    camera.position.y = 2;
    // camera.position.x = 2;


    // grid.rotation.x = 0.5;
    // grid.rotation.y = 0.5; 
    // plane.rotation.x = 90;
    // camera_gui = gui.addFolder( 'Camera' );
    // camera_gui.add(camera_gui.position,'x',-10,10,0.1);
    // camera_gui.add(camera_gui.position,'y',-10,10,0.1);
    // camera_gui.add(camera_gui.position,'z',-10,10,0.1);
    
}

function getPoints(object) {
    const material = new THREE.PointsMaterial({size: 0.05});
    const sphere = new THREE.Points(object, material);
    return sphere;
}

function getBoxHelper(size) {
    const sphere = new THREE.SphereGeometry(size, 24, 24);
    const objectect = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( 0xff0000 ));
    const box = new THREE.BoxHelper( objectect, 0xffff00 );
    return box;
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh( geometry, material )
    mesh.receiveShadow = true;  
    return mesh;
}

function getSphere(size) {
    var geometry = new THREE.SphereGeometry(size, 24, 24);
    var material = new THREE.MeshBasicMaterial({color: 0xff7700})
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

function update() {
    requestAnimationFrame(update);
    // cube.rotation.z += 0.01;
    //cube.rotation.x += 0.01;
    // orbit.update();
    renderer.render(scene, camera); 

}


var curr_num = 0

function addMesh(num) {
    scene.remove(object);
    curr_num = num;
    geometry = geoms[num];
    material = new THREE.MeshLambertMaterial({color: 0xffffff});
    object = new THREE.Mesh(geometry, material);
    object.castShadow = true;
    scene.add(object);
}

// function add3DModel() {
//     scene.remove(object);
//     let loader = new THREE.GLTFLoader();
//     loader.load('./assets/scene/20cen/scene.gltf', function(gltf){
//         gltf.scene.position.y = 12;
//         object = gltf.scene;
//         scene.add(object);
//         // scene.background = new THREE.TextureLoader().load('./assets/scene/20cen/textures/fsp__1997_2011__sky_background_by_amazingcleos_de7fvv2-full.000_emissive.jpeg');
//         // renderer.render(scene, camera);
//     })
// }

function addConNai() {
    scene.remove(object);
    // let loader = new THREE.FBXLoader();
    let loader = new THREE.GLTFLoader();

    loader.load('./assets/scene/taryk/scene.gltf', (gltf) => {
        gltf.scene.traverse(c => {
            c.castShadow = true;
        })

        object = gltf.scene;
        object.rotation.x = 1.57079633;
        scene.add(object);
    })
     
        // scene.background = new THREE.TextureLoader().load('./assets/scene/20cen/textures/fsp__1997_2011__sky_background_by_amazingcleos_de7fvv2-full.000_emissive.jpeg');
        // renderer.render(scene, camera);
}

function addPoints() {
    scene.remove(object);
    geometry = geoms[curr_num];
    material = mats[0];
    object = new THREE.Points(geometry, material);
    object.castShadow = true;
    scene.add(object);
}

function addLine() {
    scene.remove(object);
    geometry = geoms[curr_num];
    material = mats[0];
    object = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry), material);
    object.castShadow = true;

    scene.add(object);
}

function addSolid() {
    addMesh(curr_num)
}

function addTexture() {
    const file = document.getElementById('imgupload').files[0];
    if (file) {
        const imgSrc = URL.createObjectURL(file);
        const texture = new THREE.TextureLoader().load(imgSrc)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        scene.remove(object);
        geometry = geoms[curr_num];
        material = new THREE.MeshLambertMaterial({map: texture});
        object = new THREE.Mesh(geometry, material);
        object.castShadow = true;
        scene.add(object);
    }

}


var flagPoint = 0;
var flagGUI = 0;
function addPointLight() {
    // SPHERE
    if (flagPoint == 0){
        pointLight = new THREE.PointLight(0xff7700, 1);
        pointLight.position.set( 2, 2, 2 );
        pointLight.intensity = 0.5;
        pointLight.castShadow = true;

        plane = getPlane(20);
        plane.rotation.x = 1.57079633;
        // plane.castShadow = true;

        scene.add(plane);

        var sphere = getSphere(0.05);
        pointLight.add(sphere);
        scene.add(pointLight);
        flagPoint = 1;
    }

    // ADD to GUI
    if (flagGUI == 0) {
        light = gui.addFolder( 'PointLight' );
        light.add(pointLight,'intensity', 0, 1);
        light.add(pointLight.position,'x',-10,10,0.1);
        light.add(pointLight.position,'y',-10,10,0.1);
        light.add(pointLight.position,'z',-10,10,0.1);
        flagGUI = 1;
    }
    
}

function removePointLight() {
    if (flagPoint == 1){
        scene.remove(pointLight);
        scene.remove(plane);
        flagPoint = 0;
    }
}

var isPlay = false;
function activeAnimation1() {
    isPlay = true;
    animation1();
}

function activeAnimation2() {
    isPlay = true;
    animation2();
}


function removeAnimation() {  
    isPlay = false;  
}

function animation1() {
    if (!isPlay) return;
    requestAnimationFrame(animation1);
    object.rotation.y += 0.01;
    // object.rotation.x += 0.01;
    renderer.render(scene, camera);
}

function animation2() {
    if (!isPlay) return;
    requestAnimationFrame(animation2);
    object.rotation.y += 0.01;
    object.rotation.x += 0.01;
    renderer.render(scene, camera);
}




modes = ['translate', 'rotate', 'scale'];
var flagCtrl = 0;
function transform(num) {
    if (flagCtrl == 0){
        controls = new THREE.TransformControls( camera,
            renderer.domElement );
        controls.addEventListener( 'dragging-changed', function ( event ) {
        orbit.enabled = ! event.value;
        });
        controls.attach(object);
        controls.setMode(modes[num]);
        scene.add(controls);
        flagCtrl = 1;
    }
    else {
        scene.remove(controls);
        flagCtrl = 0;
    }
}

init();
update();



