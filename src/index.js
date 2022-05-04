import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1)
window.THREE = THREE

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 )
camera.position.z = 0.5
camera.position.y = -1

const scene = new THREE.Scene()

// const light = new THREE.PointLight( 0xffffff, 1, 100 );
// light.position.set( 0, 0, 5 );
// scene.add( light );

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 )
// const mesh = new THREE.Mesh( geometry, material )
// scene.add( mesh )
// const material = new THREE.MeshToonMaterial()
const material = new THREE.MeshNormalMaterial()
const loader = new STLLoader()
const model = './models/stl/3DBenchy.stl'
const loadStart = new Date()
const loadBar = document.querySelector('#loadBar')
const loading = document.querySelector('#loading')
const endLoading = _ => {
    loading.style.width = loadBar.clientWidth - 1
    loadBar.querySelector('p').innerText = `Loading done in ${(new Date() - loadStart) / 1000} seconds !`
    loadBar.style.transition = 'visibility 1.2s linear, opacity 1.2s linear'
    loadBar.style.opacity = 0
    loadBar.style.visibility = 'hidden'
}
loader.load(
    model,
    function (geometry) {
        endLoading()
        const mesh = new THREE.Mesh(geometry, material)
        const box = new THREE.Box3().setFromObject(mesh)
        let boxSize = new THREE.Vector3()
        box.getSize(boxSize)
        mesh.scale.divideScalar(boxSize.length())

        window.benchy = mesh
        scene.add(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        loading.style.width = `${loadBar.clientWidth * (xhr.loaded / xhr.total)}px`
    },
    (error) => {
        console.log(error)
    }
)

const renderer = new THREE.WebGLRenderer( { antialias: true } )
renderer.setAnimationLoop( animation )
document.querySelector('#game').appendChild( renderer.domElement )

const controls = new OrbitControls( camera, renderer.domElement )


const miniHUD = document.querySelector('#miniHUD')
const miniCam = new THREE.PerspectiveCamera( 90, 1, 0.01, 10 )
// const miniCam = new THREE.OrthographicCamera()
miniCam.position.z = 1

const miniHelper = new THREE.AxesHelper( 1 )
const miniScene = new THREE.Scene()
miniScene.add(miniHelper)

const miniRenderer = new THREE.WebGLRenderer( {
    alpha: true,
    antialias: true
} )
miniRenderer.setClearColor( 0xFFFFFF, 0.1)
miniHUD.appendChild( miniRenderer.domElement )

function animation( time ) {

	// mesh.rotation.x = time / 2000
	// mesh.rotation.y = time / 1000

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    controls.update()
    renderer.setSize( window.innerWidth, window.innerHeight )
	renderer.render( scene, camera )

    const miniVec = new THREE.Vector3(0, 0, -1)
    miniVec.applyQuaternion(camera.quaternion)
    miniVec.negate()
    miniVec.multiplyScalar(camera.position.length())
    miniCam.position.copy(miniVec)
    miniCam.setRotationFromQuaternion(camera.quaternion)
    miniRenderer.setSize( window.innerWidth / 8, window.innerWidth / 8)
	miniRenderer.render( miniScene, miniCam )
}

window.camera = camera
window.miniCam = miniCam
// window.cube = mesh
