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
    // ディスプレイの正面にコの字型テーブルを配置
    const uShapedTable = ArtRoom.createUShapedTable(
        THREE,
        ArtRoom.DIMENSIONS.TABLE_WIDTH * 3, // 幅を広く
        ArtRoom.DIMENSIONS.TABLE_HEIGHT,
        ArtRoom.DIMENSIONS.TABLE_LENGTH * 1.5, // 奥行きも広く
        ArtRoom.COLORS.TABLE_TOP
    );
    uShapedTable.position.set(
        0, // 中央に配置
        0, // 床と接するように高さを0に設定
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3 + ArtRoom.DIMENSIONS.TABLE_LENGTH * 2 // ディスプレイから少し離す
    );
    scene.add(uShapedTable);
    furniture.uShapedTable = uShapedTable;
    
    // コの字型テーブルの周りに椅子を配置（内側に向けて）
    // 中央前の椅子
    const frontChair = ArtRoom.createChair(THREE);
    frontChair.position.set(
        0,
        0,
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3 + ArtRoom.DIMENSIONS.TABLE_LENGTH * 2 + ArtRoom.DIMENSIONS.TABLE_LENGTH / 2 + ArtRoom.DIMENSIONS.CHAIR_DEPTH / 2
    );
    frontChair.rotation.y = Math.PI; // 180度回転（内側を向く）
    scene.add(frontChair);
    furniture.frontChair = frontChair;
    
    // 左側の椅子
    const leftChair = ArtRoom.createChair(THREE);
    leftChair.position.set(
        -ArtRoom.DIMENSIONS.TABLE_WIDTH * 1.5 - ArtRoom.DIMENSIONS.CHAIR_DEPTH / 2,
        0,
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3 + ArtRoom.DIMENSIONS.TABLE_LENGTH * 2
    );
    leftChair.rotation.y = -Math.PI / 2; // -90度回転（内側を向く）
    scene.add(leftChair);
    furniture.leftChair = leftChair;
    
    // 右側の椅子
    const rightChair = ArtRoom.createChair(THREE);
    rightChair.position.set(
        ArtRoom.DIMENSIONS.TABLE_WIDTH * 1.5 + ArtRoom.DIMENSIONS.CHAIR_DEPTH / 2,
        0,
        -ArtRoom.DIMENSIONS.ROOM_LENGTH / 3 + ArtRoom.DIMENSIONS.TABLE_LENGTH * 2
    );
    rightChair.rotation.y = Math.PI / 2; // 90度回転（内側を向く）
    scene.add(rightChair);
    furniture.rightChair = rightChair;

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

        // 各テーブルに3つの椅子を配置
        // 椅子1（テーブルの後ろ側）
        const chair1 = ArtRoom.createChair(THREE);
        chair1.position.set(
            pos.x, 
            0, 
            pos.z + ArtRoom.DIMENSIONS.TABLE_LENGTH / 2 + ArtRoom.DIMENSIONS.CHAIR_DEPTH / 2
        );
        scene.add(chair1);
        furniture.studentChairs.push(chair1);
        
        // 椅子2（テーブルの左側）
        const chair2 = ArtRoom.createChair(THREE);
        chair2.position.set(
            pos.x - ArtRoom.DIMENSIONS.TABLE_WIDTH / 2 - ArtRoom.DIMENSIONS.CHAIR_DEPTH / 2, 
            0, 
            pos.z
        );
        chair2.rotation.y = Math.PI / 2; // 90度回転
        scene.add(chair2);
        furniture.studentChairs.push(chair2);
        
        // 椅子3（テーブルの右側）
        const chair3 = ArtRoom.createChair(THREE);
        chair3.position.set(
            pos.x + ArtRoom.DIMENSIONS.TABLE_WIDTH / 2 + ArtRoom.DIMENSIONS.CHAIR_DEPTH / 2, 
            0, 
            pos.z
        );
        chair3.rotation.y = -Math.PI / 2; // -90度回転
        scene.add(chair3);
        furniture.studentChairs.push(chair3);
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
        
        // モデルを90度回転させる（横倒しになっているのを修正）
        mesh.rotation.x = -Math.PI / 2; // X軸周りに-90度回転
        
        // モデルの位置を調整（コの字型テーブルの上の中央）
        // furniture.uShapedTableの位置を直接参照して配置
        const tablePosition = furniture.uShapedTable.position.clone();
        tablePosition.y += ArtRoom.DIMENSIONS.TABLE_HEIGHT / 2 + 0.05; // テーブルの上に少し浮かせる
        mesh.position.copy(tablePosition);
        
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
