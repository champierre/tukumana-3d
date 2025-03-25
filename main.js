// 美術室の3Dモデルを作成するメインスクリプト
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/STLLoader.js';
import * as ArtRoom from './artRoom.js';

// 基本的な変数
let scene, camera, renderer, controls;
let room, furniture = {};
let isInitialized = false;
let stlModel = null; // STLモデル用の変数


// 初期化関数
function init() {
    if (isInitialized) return;
    isInitialized = true;

    // シーンの作成
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // カメラの設定
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(0, 1.7, 5);

    // レンダラーの設定
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // コントロールの設定
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2;

    // 照明の追加
    addLights();

    // 部屋の作成
    room = ArtRoom.createRoom(THREE);
    scene.add(room);

    // 家具の追加
    addFurniture();

    // 美術用品の追加
    const artSupplies = ArtRoom.createArtSupplies(THREE);
    artSupplies.position.set(
        ArtRoom.DIMENSIONS.ROOM_WIDTH / 2 - ArtRoom.DIMENSIONS.SHELF_DEPTH / 2 - 0.1, 
        ArtRoom.DIMENSIONS.SHELF_HEIGHT * 0.8, 
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3 + ArtRoom.DIMENSIONS.SHELF_DEPTH / 2
    );
    scene.add(artSupplies);

    // ウィンドウリサイズイベントの設定
    window.addEventListener('resize', onWindowResize, false);

    // アニメーションループの開始
    animate();
}

// 照明を追加する関数
function addLights() {
    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // メインの天井照明
    const mainLight = new THREE.PointLight(0xffffff, 0.8, 20);
    mainLight.position.set(0, ArtRoom.DIMENSIONS.ROOM_HEIGHT - 0.5, 0);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // 窓からの光
    const windowLight = new THREE.DirectionalLight(0xffffff, 0.6);
    windowLight.position.set(
        ArtRoom.DIMENSIONS.ROOM_WIDTH / 2, 
        ArtRoom.DIMENSIONS.ROOM_HEIGHT / 2, 
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 2
    );
    windowLight.castShadow = true;
    scene.add(windowLight);
}

// 家具を追加する関数
function addFurniture() {
    // 教師用デスク
    const teacherDesk = ArtRoom.createTable(
        THREE,
        ArtRoom.DIMENSIONS.TABLE_WIDTH * 1.5, 
        ArtRoom.DIMENSIONS.TABLE_HEIGHT, 
        ArtRoom.DIMENSIONS.TABLE_LENGTH * 1.5,
        ArtRoom.COLORS.TABLE_TOP
    );
    teacherDesk.position.set(
        -ArtRoom.DIMENSIONS.ROOM_WIDTH / 4, 
        ArtRoom.DIMENSIONS.TABLE_HEIGHT / 2, 
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3
    );
    scene.add(teacherDesk);
    furniture.teacherDesk = teacherDesk;

    // 教師用椅子
    const teacherChair = ArtRoom.createChair(THREE);
    teacherChair.position.set(
        -ArtRoom.DIMENSIONS.ROOM_WIDTH / 4, 
        0, 
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3 + ArtRoom.DIMENSIONS.TABLE_LENGTH
    );
    scene.add(teacherChair);
    furniture.teacherChair = teacherChair;

    // 生徒用テーブル（複数）
    const tablePositions = [
        { x: -2, z: 1 },
        { x: 0, z: 1 },
        { x: 2, z: 1 },
        { x: -2, z: 2.5 },
        { x: 0, z: 2.5 },
        { x: 2, z: 2.5 }
    ];

    furniture.studentTables = [];
    furniture.studentChairs = [];

    tablePositions.forEach((pos, index) => {
        // テーブル
        const table = ArtRoom.createTable(
            THREE,
            ArtRoom.DIMENSIONS.TABLE_WIDTH, 
            ArtRoom.DIMENSIONS.TABLE_HEIGHT, 
            ArtRoom.DIMENSIONS.TABLE_LENGTH,
            ArtRoom.COLORS.TABLE_TOP
        );
        table.position.set(
            pos.x, 
            ArtRoom.DIMENSIONS.TABLE_HEIGHT / 2, 
            pos.z
        );
        scene.add(table);
        furniture.studentTables.push(table);

        // 椅子
        const chair = ArtRoom.createChair(THREE);
        chair.position.set(
            pos.x, 
            0, 
            pos.z + ArtRoom.DIMENSIONS.TABLE_LENGTH / 2 + ArtRoom.DIMENSIONS.CHAIR_DEPTH / 2
        );
        scene.add(chair);
        furniture.studentChairs.push(chair);
    });

    // イーゼルは削除
    furniture.easels = [];

    // 棚（美術用品用）
    const shelf = ArtRoom.createShelf(THREE);
    shelf.position.set(
        ArtRoom.DIMENSIONS.ROOM_WIDTH / 2 - ArtRoom.DIMENSIONS.SHELF_DEPTH / 2 - 0.1, 
        ArtRoom.DIMENSIONS.SHELF_HEIGHT / 2, 
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3
    );
    scene.add(shelf);
    furniture.shelf = shelf;
}

// ウィンドウリサイズ時の処理
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    
    // コントロールの更新
    controls.update();
    
    // シーンのレンダリング
    renderer.render(scene, camera);
}

// STLファイルをロードする関数
function loadSTLModel(file) {
    // 既存のSTLモデルがあれば削除
    if (stlModel) {
        scene.remove(stlModel);
    }

    const reader = new FileReader();
    reader.addEventListener('load', function(event) {
        const contents = event.target.result;
        
        const loader = new STLLoader();
        const geometry = loader.parse(contents);
        
        // マテリアルの作成
        const material = new THREE.MeshStandardMaterial({
            color: 0x1E90FF, // ドジャーブルー
            roughness: 0.7,
            metalness: 0.3
        });
        
        // メッシュの作成
        const mesh = new THREE.Mesh(geometry, material);
        
        // モデルのサイズを調整
        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 0.5 / maxDim; // モデルの最大サイズを0.5メートルに制限
        mesh.scale.set(scale, scale, scale);
        
        // モデルの位置を調整（教師用デスクの上）
        mesh.position.set(
            -ArtRoom.DIMENSIONS.ROOM_WIDTH / 4, 
            ArtRoom.DIMENSIONS.TABLE_HEIGHT + 0.05, // テーブルの上に少し浮かせる
            -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3
        );
        
        // 影の設定
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // シーンに追加
        scene.add(mesh);
        stlModel = mesh;
    });
    
    reader.readAsArrayBuffer(file);
}

// ドラッグ＆ドロップのイベントハンドラを設定
function setupDragAndDrop() {
    const container = document.getElementById('canvas-container');
    
    // ドラッグオーバーイベント
    container.addEventListener('dragover', function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });
    
    // ドロップイベント
    container.addEventListener('drop', function(event) {
        event.preventDefault();
        
        const file = event.dataTransfer.files[0];
        if (file && file.name.toLowerCase().endsWith('.stl')) {
            loadSTLModel(file);
        } else {
            alert('STLファイルをドロップしてください。');
        }
    });
}

// 初期化時にドラッグ＆ドロップの設定を追加
window.addEventListener('load', function() {
    init();
    setupDragAndDrop();
});
