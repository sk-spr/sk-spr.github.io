console.log("index.js loaded")
var scene, camera, renderer, clock, deltaTime, totalTime, keyboard;

var arToolkitSource, arToolkitContext;

var markerRoot1;

var sceneGroup;

var mesh1;

initialize()
animate()

function initialize(){
    scene = new THREE.scene()
    let ambientLight = new THREE.ambientLight(0xccccc, 1.0)
    scene.add(ambientLight)
    camera = new THREE.camera()
    scene.add(camera)
    renderer = new THREE.WebGLRenderer({
        antialias:true,
        alpha:true
    })
    renderer.setClearColor(new THREE.color(lightgray))
    renderer.setSize(640, 480)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    document.body.appendChild(renderer.domElement)

    clock = new THREE.clock()
    deltaTime = 0
    totalTime = 0
    keyboard = new Keyboard()

    //set up artoolkit source
    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    })
    function onResize(){
        arToolkitSource.resize()
        arToolkitSource.copySizeTo(renderer.domElement)
        if(arToolkitContext.arController != null )
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
    }
    arToolkitSource.init(function onReady(){
        onResize()
    })
    window.addEventListener('resize', function(){onResize()})

    //setup artoolkit context
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    })
    arToolkitContext.init(function onCompleted(){
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
    })
    //setup marker roots
    markerRoot1 = new THREE.Group();
	markerRoot1.name = 'marker1';
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type : 'pattern',
		patternUrl : "data/hiro.patt",
	})

    let geometry1	= new THREE.CubeGeometry(2,2,2);
	let loader = new THREE.TextureLoader();
	let texture = loader.load( 'images/tiles.jpg', render );
	let material1	= new THREE.MeshLambertMaterial({
		transparent : true,
		map: texture,
		side: THREE.BackSide
	}); 
	
	mesh1 = new THREE.Mesh( geometry1, material1 );
	mesh1.position.y = -1;
	
	markerRoot1.add( mesh1 );
	
	// the invisibility cloak (plane with a hole)
	let geometry0 = new THREE.PlaneGeometry(18,18, 9,9);
	geometry0.faces.splice(80, 2); // make hole by removing top two triangles
	geometry0.faceVertexUvs[0].splice(80, 2);
	
	let material0 = new THREE.MeshBasicMaterial({
		// map: loader.load( 'images/color-grid.png' ), // for testing placement
		colorWrite: false
	});
	
	let mesh0 = new THREE.Mesh( geometry0, material0 );
	
	mesh0.rotation.x = -Math.PI/2;
	markerRoot1.add(mesh0);	


}
function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}
function render(){
    renderer.render( scene, camera );
}

function animate(){
    requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}