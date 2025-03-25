// 美術室の3Dモデルのコンポーネント

// 色の定義
export const COLORS = {
    FLOOR: 0xD3D3D3,      // 床の色（薄いグレー）
    WALL: 0xF5F5F5,       // 壁の色（白に近いグレー）
    CEILING: 0xFFFFFF,    // 天井の色（白）
    WOOD: 0xA0522D,       // 木材の色（茶色）
    METAL: 0xC0C0C0,      // 金属の色（シルバー）
    BLACKBOARD: 0x2F4F4F, // 黒板の色（暗い緑がかったグレー）
    WINDOW_FRAME: 0x8B4513, // 窓枠の色（茶色）
    GLASS: 0xADD8E6,      // ガラスの色（薄い青）
    TABLE_TOP: 0xDEB887,  // テーブルトップの色（薄い茶色）
    CHAIR_SEAT: 0xCD853F, // 椅子の座面の色（茶色）
    EASEL: 0x8B4513,      // イーゼルの色（茶色）
    SHELF: 0xD2B48C,      // 棚の色（薄い茶色）
    PAINT_RED: 0xFF0000,  // 赤い絵の具
    PAINT_BLUE: 0x0000FF, // 青い絵の具
    PAINT_YELLOW: 0xFFFF00, // 黄色い絵の具
    CANVAS: 0xFFFFF0      // キャンバスの色（オフホワイト）
};

// 寸法の定義（メートル単位）
export const DIMENSIONS = {
    ROOM_WIDTH: 8,        // 部屋の幅
    ROOM_LENGTH: 10,      // 部屋の長さ
    ROOM_HEIGHT: 3,       // 部屋の高さ
    WALL_THICKNESS: 0.2,  // 壁の厚さ
    WINDOW_WIDTH: 1.5,    // 窓の幅
    WINDOW_HEIGHT: 1.2,   // 窓の高さ
    DOOR_WIDTH: 1,        // ドアの幅
    DOOR_HEIGHT: 2.2,     // ドアの高さ
    TABLE_WIDTH: 1.2,     // テーブルの幅
    TABLE_LENGTH: 0.8,    // テーブルの長さ
    TABLE_HEIGHT: 0.6,   // テーブルの高さ
    CHAIR_WIDTH: 0.4,     // 椅子の幅
    CHAIR_DEPTH: 0.4,     // 椅子の奥行き
    CHAIR_HEIGHT: 0.45,   // 椅子の高さ
    CHAIR_BACK_HEIGHT: 0.4, // 椅子の背もたれの高さ
    EASEL_WIDTH: 0.6,     // イーゼルの幅
    EASEL_HEIGHT: 1.8,    // イーゼルの高さ
    SHELF_WIDTH: 1.5,     // 棚の幅
    SHELF_DEPTH: 0.4,     // 棚の奥行き
    SHELF_HEIGHT: 2,      // 棚の高さ
    BLACKBOARD_WIDTH: 3,  // 黒板の幅
    BLACKBOARD_HEIGHT: 1.2 // 黒板の高さ
};

// 部屋を作成する関数
export function createRoom(THREE) {
    const room = new THREE.Group();
    
    // 床
    const floorGeometry = new THREE.BoxGeometry(
        DIMENSIONS.ROOM_WIDTH, 
        DIMENSIONS.WALL_THICKNESS, 
        DIMENSIONS.ROOM_LENGTH
    );
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.FLOOR,
        roughness: 0.8,
        metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -DIMENSIONS.WALL_THICKNESS / 2;
    floor.receiveShadow = true;
    room.add(floor);

    // 天井
    const ceilingGeometry = new THREE.BoxGeometry(
        DIMENSIONS.ROOM_WIDTH, 
        DIMENSIONS.WALL_THICKNESS, 
        DIMENSIONS.ROOM_LENGTH
    );
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.CEILING,
        roughness: 0.9,
        metalness: 0.1
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = DIMENSIONS.ROOM_HEIGHT + DIMENSIONS.WALL_THICKNESS / 2;
    ceiling.receiveShadow = true;
    room.add(ceiling);

    // 壁を作成
    createWalls(THREE, room);

    return room;
}

// 壁を作成する関数
function createWalls(THREE, room) {
    // 壁の材質
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.WALL,
        roughness: 0.9,
        metalness: 0.1
    });

    // 後ろの壁（黒板がある壁）
    const backWallGeometry = new THREE.BoxGeometry(
        DIMENSIONS.ROOM_WIDTH, 
        DIMENSIONS.ROOM_HEIGHT, 
        DIMENSIONS.WALL_THICKNESS
    );
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(
        0, 
        DIMENSIONS.ROOM_HEIGHT / 2, 
        -DIMENSIONS.ROOM_LENGTH / 2
    );
    backWall.receiveShadow = true;
    room.add(backWall);

    // 巨大ディスプレイの追加
    const displayGroup = new THREE.Group();
    
    // ディスプレイ本体（薄型）
    const displayGeometry = new THREE.BoxGeometry(
        DIMENSIONS.BLACKBOARD_WIDTH, 
        DIMENSIONS.BLACKBOARD_HEIGHT, 
        DIMENSIONS.WALL_THICKNESS / 8
    );
    const displayMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111, // ディスプレイの枠（黒）
        roughness: 0.5,
        metalness: 0.8
    });
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    displayGroup.add(display);
    
    // ディスプレイの画面
    const screenGeometry = new THREE.PlaneGeometry(
        DIMENSIONS.BLACKBOARD_WIDTH - 0.1, 
        DIMENSIONS.BLACKBOARD_HEIGHT - 0.1
    );
    const screenMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x0077cc, // 青色の画面
        roughness: 0.1,
        metalness: 0.5,
        emissive: 0x003366, // 発光効果
        emissiveIntensity: 0.5
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = DIMENSIONS.WALL_THICKNESS / 8 + 0.001; // 少し前に出す
    displayGroup.add(screen);
    
    // ディスプレイの位置設定
    displayGroup.position.set(
        0, 
        DIMENSIONS.ROOM_HEIGHT / 2, 
        -DIMENSIONS.ROOM_LENGTH / 2 + DIMENSIONS.WALL_THICKNESS / 2 + 0.02
    );
    room.add(displayGroup);

    // 前の壁（ドアがある壁）
    const frontWallGeometry = new THREE.BoxGeometry(
        DIMENSIONS.ROOM_WIDTH, 
        DIMENSIONS.ROOM_HEIGHT, 
        DIMENSIONS.WALL_THICKNESS
    );
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(
        0, 
        DIMENSIONS.ROOM_HEIGHT / 2, 
        DIMENSIONS.ROOM_LENGTH / 2
    );
    frontWall.receiveShadow = true;
    room.add(frontWall);

    // ドアの作成（前の壁に穴を開ける）
    const doorGeometry = new THREE.BoxGeometry(
        DIMENSIONS.DOOR_WIDTH, 
        DIMENSIONS.DOOR_HEIGHT, 
        DIMENSIONS.WALL_THICKNESS + 0.1
    );
    const doorMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.WOOD,
        roughness: 0.8,
        metalness: 0.2
    });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(
        DIMENSIONS.ROOM_WIDTH / 4, 
        DIMENSIONS.DOOR_HEIGHT / 2, 
        DIMENSIONS.ROOM_LENGTH / 2
    );
    room.add(door);

    // 左の壁（窓がある壁）
    const leftWallGeometry = new THREE.BoxGeometry(
        DIMENSIONS.WALL_THICKNESS, 
        DIMENSIONS.ROOM_HEIGHT, 
        DIMENSIONS.ROOM_LENGTH
    );
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(
        -DIMENSIONS.ROOM_WIDTH / 2, 
        DIMENSIONS.ROOM_HEIGHT / 2, 
        0
    );
    leftWall.receiveShadow = true;
    room.add(leftWall);

    // 窓の作成
    createWindow(THREE, room, -DIMENSIONS.ROOM_WIDTH / 2, DIMENSIONS.ROOM_HEIGHT / 2, -DIMENSIONS.ROOM_LENGTH / 4);
    createWindow(THREE, room, -DIMENSIONS.ROOM_WIDTH / 2, DIMENSIONS.ROOM_HEIGHT / 2, DIMENSIONS.ROOM_LENGTH / 4);

    // 右の壁
    const rightWallGeometry = new THREE.BoxGeometry(
        DIMENSIONS.WALL_THICKNESS, 
        DIMENSIONS.ROOM_HEIGHT, 
        DIMENSIONS.ROOM_LENGTH
    );
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(
        DIMENSIONS.ROOM_WIDTH / 2, 
        DIMENSIONS.ROOM_HEIGHT / 2, 
        0
    );
    rightWall.receiveShadow = true;
    room.add(rightWall);
    
    // 右側の壁に窓を追加
    createWindow(THREE, room, DIMENSIONS.ROOM_WIDTH / 2, DIMENSIONS.ROOM_HEIGHT / 2, -DIMENSIONS.ROOM_LENGTH / 4);
    createWindow(THREE, room, DIMENSIONS.ROOM_WIDTH / 2, DIMENSIONS.ROOM_HEIGHT / 2, DIMENSIONS.ROOM_LENGTH / 4);
}

// 窓を作成する関数
function createWindow(THREE, room, x, y, z) {
    // 窓枠
    const windowFrameGeometry = new THREE.BoxGeometry(
        DIMENSIONS.WALL_THICKNESS + 0.1, 
        DIMENSIONS.WINDOW_HEIGHT, 
        DIMENSIONS.WINDOW_WIDTH
    );
    const windowFrameMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.WINDOW_FRAME,
        roughness: 0.8,
        metalness: 0.2
    });
    const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
    windowFrame.position.set(x, y, z);
    room.add(windowFrame);

    // 窓ガラス
    const glassGeometry = new THREE.BoxGeometry(
        DIMENSIONS.WALL_THICKNESS / 4, 
        DIMENSIONS.WINDOW_HEIGHT - 0.1, 
        DIMENSIONS.WINDOW_WIDTH - 0.1
    );
    const glassMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.GLASS,
        roughness: 0.05,
        metalness: 0.95,
        transparent: true,
        opacity: 0.1 // さらに透明度を上げる
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.set(x, y, z);
    room.add(glass);
    
    // 窓の外の景色（空）- 窓枠の内側に配置
    const outsideGeometry = new THREE.PlaneGeometry(
        DIMENSIONS.WINDOW_WIDTH - 0.2, 
        DIMENSIONS.WINDOW_HEIGHT - 0.2
    );
    
    // 空のグラデーション
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const skyContext = skyCanvas.getContext('2d');
    
    // グラデーションの作成
    const gradient = skyContext.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#87CEEB'); // 空色（上部）
    gradient.addColorStop(0.7, '#E0F7FF'); // 薄い空色（中部）
    gradient.addColorStop(1, '#7CFC00'); // 草原色（下部）
    
    skyContext.fillStyle = gradient;
    skyContext.fillRect(0, 0, 512, 512);
    
    // 雲を追加
    skyContext.fillStyle = 'rgba(255, 255, 255, 0.8)';
    skyContext.beginPath();
    skyContext.arc(100, 100, 40, 0, Math.PI * 2);
    skyContext.arc(140, 90, 50, 0, Math.PI * 2);
    skyContext.arc(180, 100, 40, 0, Math.PI * 2);
    skyContext.fill();
    
    skyContext.beginPath();
    skyContext.arc(350, 150, 30, 0, Math.PI * 2);
    skyContext.arc(390, 140, 40, 0, Math.PI * 2);
    skyContext.arc(430, 150, 30, 0, Math.PI * 2);
    skyContext.fill();
    
    // テクスチャの作成
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    
    const outsideMaterial = new THREE.MeshBasicMaterial({
        map: skyTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0
    });
    
    const outside = new THREE.Mesh(outsideGeometry, outsideMaterial);
    
    // 窓の内側に配置（窓ガラスのすぐ後ろ）
    if (Math.abs(x) > Math.abs(z)) {
        // 左右の壁の窓
        const offset = x > 0 ? -0.05 : 0.05; // 右側か左側かで調整（内側に配置）
        outside.position.set(x + offset, y, z);
        
        // 窓の向きに合わせて回転
        if (x > 0) { // 右側の壁
            outside.rotation.y = Math.PI / 2;
        } else { // 左側の壁
            outside.rotation.y = -Math.PI / 2;
        }
    } else {
        // 前後の壁の窓（もし追加する場合）
        const offset = z > 0 ? -0.05 : 0.05; // 前側か後側かで調整（内側に配置）
        outside.position.set(x, y, z + offset);
        
        // 窓の向きに合わせて回転
        if (z > 0) { // 前側の壁
            outside.rotation.y = Math.PI;
        } else { // 後側の壁
            outside.rotation.y = 0;
        }
    }
    
    room.add(outside);
}

// テーブルを作成する関数
export function createTable(THREE, width, height, depth, color) {
    const table = new THREE.Group();
    
    // テーブルトップ（六角形）
    const radius = Math.max(width, depth) / 2;
    const topGeometry = new THREE.CylinderGeometry(radius, radius, height / 10, 6);
    const topMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.8,
        metalness: 0.2
    });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    // テーブルトップの位置を下げる
    // テーブルトップの上部が脚の上部よりも少し下になるように設定
    top.position.y = height * 0.5;
    // テーブルトップを回転させる
    // y軸周りの回転（60度）
    top.rotation.y = Math.PI / 6;
    top.castShadow = true;
    top.receiveShadow = true;
    table.add(top);
    
    // テーブルの脚
    const legGeometry = new THREE.BoxGeometry(width / 20, height, depth / 20);
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.WOOD,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // 6本の脚を追加（六角形の内側、頂点から床に垂直に）
    const legPositions = [];
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        // 六角形の内側に脚を配置（半径の60%の位置）
        const x = Math.cos(angle) * (radius * 0.8);
        const z = Math.sin(angle) * (radius * 0.8);
        legPositions.push({ x, z });
    }
    
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        // 脚の位置を床に接するように設定（y=0）
        leg.position.set(pos.x, 0, pos.z);
        leg.castShadow = true;
        leg.receiveShadow = true;
        table.add(leg);
    });
    
    return table;
}

// コの字型テーブルを作成する関数
export function createUShapedTable(THREE, width, height, depth, color) {
    const table = new THREE.Group();
    
    // テーブルの厚さ
    const thickness = height / 10;
    
    // テーブルトップのマテリアル
    const topMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // 脚のマテリアル
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.WOOD,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // 中央のテーブルトップ
    const centerTopGeometry = new THREE.BoxGeometry(width, thickness, depth);
    const centerTop = new THREE.Mesh(centerTopGeometry, topMaterial);
    centerTop.position.y = height - thickness / 2;
    centerTop.castShadow = true;
    centerTop.receiveShadow = true;
    table.add(centerTop);
    
    // 左側のテーブルトップ
    const leftTopGeometry = new THREE.BoxGeometry(thickness, thickness, depth);
    const leftTop = new THREE.Mesh(leftTopGeometry, topMaterial);
    leftTop.position.set(-width / 2 - thickness / 2, height - thickness / 2, 0);
    leftTop.castShadow = true;
    leftTop.receiveShadow = true;
    table.add(leftTop);
    
    // 右側のテーブルトップ
    const rightTopGeometry = new THREE.BoxGeometry(thickness, thickness, depth);
    const rightTop = new THREE.Mesh(rightTopGeometry, topMaterial);
    rightTop.position.set(width / 2 + thickness / 2, height - thickness / 2, 0);
    rightTop.castShadow = true;
    rightTop.receiveShadow = true;
    table.add(rightTop);
    
    // 脚の太さ
    const legThickness = width / 30;
    
    // テーブルの4隅に1本ずつ脚を配置
    const legPositions = [
        // 左前の脚
        { x: -width / 2 - thickness + legThickness / 2, z: depth / 2 - legThickness / 2 },
        // 左後ろの脚
        { x: -width / 2 - thickness + legThickness / 2, z: -depth / 2 + legThickness / 2 },
        // 右前の脚
        { x: width / 2 + thickness - legThickness / 2, z: depth / 2 - legThickness / 2 },
        // 右後ろの脚
        { x: width / 2 + thickness - legThickness / 2, z: -depth / 2 + legThickness / 2 }
    ];
    
    legPositions.forEach(pos => {
        const legGeometry = new THREE.BoxGeometry(legThickness, height, legThickness);
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos.x, height / 2, pos.z);
        leg.castShadow = true;
        leg.receiveShadow = true;
        table.add(leg);
    });
    
    return table;
}

// 椅子を作成する関数
export function createChair(THREE) {
    const chair = new THREE.Group();
    
    // 丸い座面
    const seatRadius = Math.max(DIMENSIONS.CHAIR_WIDTH, DIMENSIONS.CHAIR_DEPTH) / 2;
    const seatGeometry = new THREE.CylinderGeometry(
        seatRadius, 
        seatRadius, 
        DIMENSIONS.CHAIR_HEIGHT / 10, 
        32
    );
    const seatMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.WOOD,
        roughness: 0.8,
        metalness: 0.2
    });
    const seat = new THREE.Mesh(seatGeometry, seatMaterial);
    seat.position.y = DIMENSIONS.CHAIR_HEIGHT;
    seat.castShadow = true;
    seat.receiveShadow = true;
    chair.add(seat);
    
    // 脚の材質
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.WOOD,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // 円周上に4本の脚を配置
    const legRadius = seatRadius * 0.8; // 脚の配置半径
    const legThickness = seatRadius / 10; // 脚の太さ
    
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i + (Math.PI / 4); // 45度ずらして配置
        const legGeometry = new THREE.CylinderGeometry(
            legThickness, 
            legThickness, 
            DIMENSIONS.CHAIR_HEIGHT, 
            8
        );
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        
        // 脚は地面と垂直に配置（回転なし）
        
        // 脚の位置を設定
        leg.position.set(
            Math.cos(angle) * legRadius, 
            DIMENSIONS.CHAIR_HEIGHT / 2, 
            Math.sin(angle) * legRadius
        );
        
        leg.castShadow = true;
        leg.receiveShadow = true;
        chair.add(leg);
    }
    
    return chair;
}

// イーゼルを作成する関数
export function createEasel(THREE) {
    const easel = new THREE.Group();
    
    // イーゼルの脚
    const legGeometry = new THREE.BoxGeometry(
        DIMENSIONS.EASEL_WIDTH / 30, 
        DIMENSIONS.EASEL_HEIGHT, 
        DIMENSIONS.EASEL_WIDTH / 30
    );
    const legMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.EASEL,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // 3本の脚を追加
    const frontLeg1 = new THREE.Mesh(legGeometry, legMaterial);
    frontLeg1.position.set(-DIMENSIONS.EASEL_WIDTH / 4, DIMENSIONS.EASEL_HEIGHT / 2, 0);
    frontLeg1.castShadow = true;
    frontLeg1.receiveShadow = true;
    easel.add(frontLeg1);
    
    const frontLeg2 = new THREE.Mesh(legGeometry, legMaterial);
    frontLeg2.position.set(DIMENSIONS.EASEL_WIDTH / 4, DIMENSIONS.EASEL_HEIGHT / 2, 0);
    frontLeg2.castShadow = true;
    frontLeg2.receiveShadow = true;
    easel.add(frontLeg2);
    
    const backLeg = new THREE.Mesh(legGeometry, legMaterial);
    backLeg.position.set(0, DIMENSIONS.EASEL_HEIGHT / 2, -DIMENSIONS.EASEL_WIDTH / 3);
    backLeg.rotation.x = Math.PI / 8;
    backLeg.castShadow = true;
    backLeg.receiveShadow = true;
    easel.add(backLeg);
    
    // キャンバスを支える横棒
    const supportGeometry = new THREE.BoxGeometry(
        DIMENSIONS.EASEL_WIDTH, 
        DIMENSIONS.EASEL_WIDTH / 20, 
        DIMENSIONS.EASEL_WIDTH / 20
    );
    const supportMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.EASEL,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // 上部の横棒
    const topSupport = new THREE.Mesh(supportGeometry, supportMaterial);
    topSupport.position.set(0, DIMENSIONS.EASEL_HEIGHT * 0.8, 0);
    topSupport.castShadow = true;
    topSupport.receiveShadow = true;
    easel.add(topSupport);
    
    // 下部の横棒
    const bottomSupport = new THREE.Mesh(supportGeometry, supportMaterial);
    bottomSupport.position.set(0, DIMENSIONS.EASEL_HEIGHT * 0.2, 0);
    bottomSupport.castShadow = true;
    bottomSupport.receiveShadow = true;
    easel.add(bottomSupport);
    
    // キャンバス
    const canvasGeometry = new THREE.BoxGeometry(
        DIMENSIONS.EASEL_WIDTH * 0.8, 
        DIMENSIONS.EASEL_HEIGHT * 0.6, 
        DIMENSIONS.EASEL_WIDTH / 50
    );
    const canvasMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.CANVAS,
        roughness: 0.9,
        metalness: 0.1
    });
    const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvas.position.set(0, DIMENSIONS.EASEL_HEIGHT * 0.5, DIMENSIONS.EASEL_WIDTH / 100);
    canvas.castShadow = true;
    canvas.receiveShadow = true;
    easel.add(canvas);
    
    return easel;
}

// 棚を作成する関数
export function createShelf(THREE) {
    const shelf = new THREE.Group();
    
    // 棚の外枠
    const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.SHELF,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // 背面パネル
    const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(DIMENSIONS.SHELF_WIDTH, DIMENSIONS.SHELF_HEIGHT, DIMENSIONS.SHELF_DEPTH / 20),
        frameMaterial
    );
    backPanel.position.z = -DIMENSIONS.SHELF_DEPTH / 2 + DIMENSIONS.SHELF_DEPTH / 40;
    backPanel.castShadow = true;
    backPanel.receiveShadow = true;
    shelf.add(backPanel);
    
    // 側面パネル（左）
    const leftPanel = new THREE.Mesh(
        new THREE.BoxGeometry(DIMENSIONS.SHELF_DEPTH / 20, DIMENSIONS.SHELF_HEIGHT, DIMENSIONS.SHELF_DEPTH),
        frameMaterial
    );
    leftPanel.position.x = -DIMENSIONS.SHELF_WIDTH / 2 + DIMENSIONS.SHELF_DEPTH / 40;
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    shelf.add(leftPanel);
    
    // 側面パネル（右）
    const rightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(DIMENSIONS.SHELF_DEPTH / 20, DIMENSIONS.SHELF_HEIGHT, DIMENSIONS.SHELF_DEPTH),
        frameMaterial
    );
    rightPanel.position.x = DIMENSIONS.SHELF_WIDTH / 2 - DIMENSIONS.SHELF_DEPTH / 40;
    rightPanel.castShadow = true;
    rightPanel.receiveShadow = true;
    shelf.add(rightPanel);
    
    // 棚板（複数）
    const shelfLevels = 5;
    for (let i = 0; i < shelfLevels; i++) {
        const shelfBoard = new THREE.Mesh(
            new THREE.BoxGeometry(DIMENSIONS.SHELF_WIDTH, DIMENSIONS.SHELF_DEPTH / 20, DIMENSIONS.SHELF_DEPTH),
            frameMaterial
        );
        shelfBoard.position.y = -DIMENSIONS.SHELF_HEIGHT / 2 + (i * DIMENSIONS.SHELF_HEIGHT / (shelfLevels - 1));
        shelfBoard.castShadow = true;
        shelfBoard.receiveShadow = true;
        shelf.add(shelfBoard);
    }
    
    return shelf;
}

// 美術用品を追加する関数（簡略化）
export function createArtSupplies(THREE) {
    const artSupplies = new THREE.Group();
    
    // 絵の具セット
    const paintSet = new THREE.Group();
    
    // 絵の具のチューブ（複数色）
    const paintTubeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 16);
    
    // 赤い絵の具
    const redPaintMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.PAINT_RED,
        roughness: 0.7,
        metalness: 0.3
    });
    const redPaint = new THREE.Mesh(paintTubeGeometry, redPaintMaterial);
    redPaint.position.set(-0.1, 0, 0);
    redPaint.rotation.x = Math.PI / 2;
    redPaint.castShadow = true;
    paintSet.add(redPaint);
    
    // 青い絵の具
    const bluePaintMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.PAINT_BLUE,
        roughness: 0.7,
        metalness: 0.3
    });
    const bluePaint = new THREE.Mesh(paintTubeGeometry, bluePaintMaterial);
    bluePaint.position.set(0, 0, 0);
    bluePaint.rotation.x = Math.PI / 2;
    bluePaint.castShadow = true;
    paintSet.add(bluePaint);
    
    // 黄色い絵の具
    const yellowPaintMaterial = new THREE.MeshStandardMaterial({ 
        color: COLORS.PAINT_YELLOW,
        roughness: 0.7,
        metalness: 0.3
    });
    const yellowPaint = new THREE.Mesh(paintTubeGeometry, yellowPaintMaterial);
    yellowPaint.position.set(0.1, 0, 0);
    yellowPaint.rotation.x = Math.PI / 2;
    yellowPaint.castShadow = true;
    paintSet.add(yellowPaint);
    
    paintSet.position.set(0, 0.5, 0);
    artSupplies.add(paintSet);
    
    return artSupplies;
}
