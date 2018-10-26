//
//	「ゴーストの館」
//

// enchant.jsを使う場合に記入
enchant(); 

// 最初にtouch to startと出るのを止める
enchant.ENV.USE_TOUCH_TO_START_SCENE = false;
enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI = true;

// ゲーム
var game;

// 画面サイズ
var WIDTH = 640;
var HEIGHT = 960;

//var surface;

var mouseX = -100;					//	マウスのX座標
var mouseY = -100;					//	マウスのY座標

var gameLevel = -1;	//	0...easy, 1...normal, 2...hard

var prevStageScore = 0;  //  前ステージのスコア

var stageData;		//	ステージ情報
var stageSprite;	//	表示するためのスプライト
var stageFrame;     //  ステージのアニメーションパターン

// 画像
var  START_LOGO = './images/effect_start01.png',  //  スタート！のロゴ
	START_LOGO2 = './images/effect_start02.png',  //  スタート！のロゴ

	BLOCK = './images/block.png',
	BREAK_BLOCK = './images/block_anm.png',
	MAPCHIP03 = './images/floor.png',
	MAPCHIP05 = './images/goal.png',
    INFO_WINDOW = './images/UI_window01.png',
    INFO_WINDOW_TIMER = './images/UI_window01_effect.png',
    UI_LIFE = './images/UI_lifeicon.png',
    UI_SEC = './images/UI_text_second.png',
    UI_ARROW = './images/UI_arrow.png',
    TITLE = './images/Title.png',
    TITLE_LOGO = './images/title_logo.png',
    TITLE_PLAYER = './images/title_player.png',
    BTN_EASY = './images/button_01.png',
    BTN_NORMAL = './images/button_02.png',
    BTN_HARD = './images/button_03.png',
    BTN_TUTORIAL = './images/button_04.png',

    ITEM = './images/item.png',
    ITEM_EFFECT = './images/effect01.png',
    ITEM_GLASS_WINDOW = './images/UI_text_discover.png',
    ITEM_CANDY_WINDOW = './images/UI_text_double_score.png',
    ITEM_STAR_WINDOW = './images/UI_text_matchless.png',
    ITEM_BAR_WINDOW = './images/UI_text_graph_window.png',
    ITEM_BAR = './images/UI_text_graph_bar.png',

	BG_EASY = './images/BG_easy.png',
	BG_NORMAL = './images/BG_normal.png',
	BG_HARD = './images/BG_hard.png',
    BG_LEFT01 = './images/BG_left_cliff01.png',
    BG_RIGHT01 = './images/BG_right_cliff01.png',
    BG_LEFT02 = './images/BG_left_cliff02.png',
    BG_RIGHT02 = './images/BG_right_cliff02.png',
    BG_LEFT03 = './images/BG_left_cliff03.png',
    BG_RIGHT03 = './images/BG_right_cliff03.png',
    BG_LASTLIFE = './images/BG_last_life.png',

    UI_SCORE = './images/UI_score.png',
    NUMBER = './images/numeral.png',
    NUMBER_SMALL = './images/numeral_small.png',

    PLAYER_ANIM = './images/player.png',

    GHOST = './images/ghost.png',
    GHOST_EFFECT = './images/effect_ghost.png',

    RESULT_BG = './images/result_BG.png',
    RESULT_WINDOW = './images/result_BG_details.png',
    RESULT_CAPTION = './images/result_BG_clear.png',
    RESULT_REPLAY = './images/result_button_replay.png',
    RESULT_KEEP = './images/result_button_keep.png',
    RESULT_TITLE = './images/result_button_title.png',

    RESULT_RANK = './images/result_rank.png',

    BG_TUTORIAL = './images/tutorial.png',
    GAMEOVER_BG = './images/gameover_BG.png',
    GAMEOVER_CAPTION = './images/gameover_BG_gameover.png',

	INGAME_BGM = './sounds/BGM.wav',
	SE_OK = './sounds/SE_OK.wav',
	SE_START = './sounds/SE_START.wav',
	SE_BREAK = './sounds/SE_BREAK.wav',
	SE_DAMAGE = './sounds/SE_DAMAGE.wav',
	SE_WALK = './sounds/SE_WALK.wav',
    SE_GET = './sounds/SE_GET.wav',
    SE_CLEAR = './sounds/SE_CLEAR.wav',
    SE_SCORE = './sounds/SE_SCORE.wav',
    SE_GOAL = './sounds/SE_GOAL.wav'
	;
	
// すでにイベントがあるかもしれないので追加で登録	
try {
	window.addEventListener('load',initGame,false);
	window.addEventListener("load", function() {
    setTimeout(function() {
        scrollBy(0, 1);
    }, 100);
}, false);
} catch(e) {
	window.addEventListener('onLoad',initGame);
	window.addEventListener("onLoad", function() {
    setTimeout(function() {
        scrollBy(0, 1);
    }, 100);
}, false);
}

//------------------------------------------------------------------------------------------------------------------
//  ゲーム中に使用している便利関数
//------------------------------------------------------------------------------------------------------------------

// ランダム関数
//	minからmax(まで含む)値を生成
function rand(min,max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 外積を求める(あたり判定用)
function cross(ax,ay, bx,by)
{
    return ax * by - ay * bx;
}

//  三角形の中に点は含まれてる？
function pointInTriangle(px,py, ax,ay, bx,by, cx,cy)
{
    if (cross(px-ax,py-ay, bx-ax,by-ay) < 0.0) return -1;
    if (cross(px-bx,py-by, cx-bx,cy-by) < 0.0) return -1;
    if (cross(px-cx,py-cy, ax-cx,ay-cy) < 0.0) return -1;

    //  含まれている
    return 1;    
}

//  補間関数
function easeIn(start, goal, time) {
	return -(goal - start) * Math.cos(time / 1.0 * (Math.PI / 2)) + (goal - start) + start;
};

//  補間関数
function easeOut(start, goal, time) {
	return (goal - start) * Math.sin(time / 1.0 * (Math.PI/2)) + start;
};

//  ２点間の距離を求める
function calcDist(x1,y1,x2,y2)
{
    var xdist = (x2 - x1) * (x2 - x1);
    var ydist = (y2 - y1) * (y2 - y1);
    var xydist = Math.sqrt(xdist + ydist);
    return xydist;
}

//------------------------------------------------------------------------------------------------------------------
//  タイトルロゴアニメーション
//------------------------------------------------------------------------------------------------------------------
var TITLE_LOGO_WIDTH = 640;
var TITLE_LOGO_HEIGHT = 586;
var titleLogoSprite;    //  タイトルロゴ
var titleLogoAnimWaitMax = 4;
var titleLogoAnimWait = 4;
var titleLogoAnimIndex = 0;

//  タイトル画面のアニメーション処理
function animTitleLogo()
{
    titleLogoAnimWait--;
    if (titleLogoAnimWait <= 0)
    {
        titleLogoAnimWait = titleLogoAnimWaitMax;
        titleLogoAnimIndex++;
        if (titleLogoAnimIndex >= 10)
        {
            titleLogoAnimIndex = 0;
        }
        titleLogoSprite.frame = titleLogoAnimIndex;
    }    
}

//------------------------------------------------------------------------------------------------------------------
//  お化けのアニメーション
//------------------------------------------------------------------------------------------------------------------
var GHOST_MAX;
var GHOST_MAX_TABLE = [3, 8, 12];	//	レベルによるお化け配置数

//  ステージ上のどこにお化けがいるのかの情報を保存　
var ghostIndexData;

//  列挙型もどき
var GHOST_STATE_ATTACK = 0;
var GHOST_STATE_MOVE = 1;
var GHOST_STATE_ENTRY = 2;
var GHOST_STATE_WAIT = 3;

var GHOST_WIDTH = 128;
var GHOST_HEIGHT = 128;

var GHOST_ANIM_NUM = [11, 6, 5, 2];   //それぞれのアニメーションパターン毎のアニメーション枚数
var GHOST_ATTACK_ANIM_TABLE = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];    //  コマを表示する時間
var GHOST_MOVE_ANIM_TABLE = [3, 3, 3, 3, 3, 3];                     //  コマを表示する時間
var GHOST_ENTRY_ANIM_TABLE = [3, 3, 3, 3, 3];                       //  コマを表示する時間
var GHOST_WAIT_ANIM_TABLE = [15, 15];                               //  コマを表示する時間

var ghostSpriteTable;           //  お化けのスプライト
var ghostAnimWaitTable;         //  現在のウエイト値
var ghostAnimNowIndexTable;     //  現在のパターン番号
var ghostAnimStartFrameTable;    //  アニメーション開始フレーム
var ghostAnimStateTable;         //  どのアニメーションをしているのか？(0...攻撃、1...移動, 2...出現, 3...待機)

//  お化けアニメーションの初期化
function initAnimGhost()
{
    //  配列を確保
    ghostAnimWaitTable = new Array(GHOST_MAX);
    ghostAnimNowIndexTable = new Array(GHOST_MAX);
    ghostAnimStartFrameTable = new Array(GHOST_MAX);
    ghostAnimStateTable = new Array(GHOST_MAX);

    //  それぞれを初期化
    for(var ghostIndex = 0; ghostIndex < GHOST_MAX; ghostIndex++)
    {
        ghostAnimStateTable[ghostIndex] = GHOST_STATE_WAIT;
        ghostAnimNowIndexTable[ghostIndex] = rand(0, 1); //  バラバラにしておかないとアニメーションが揃って気持ち悪い
        ghostAnimWaitTable[ghostIndex] = rand(0, GHOST_WAIT_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]]); //  バラバラにしておかないとアニメーションが揃って気持ち悪い
//        ghostAnimStartFrameTable[ghostIndex] = new Array(GHOST_MAX);
    }
}

//  プレイヤーのアニメーションを切り替える
function changeGhostAnim(ghostIndex, newState)
{
    //  使用していない場所を参照しないようにリターン
    if (ghostIndex == -1)
    {
        return;
    }

    //  ステートの変更がないのならリターン    
    if (ghostAnimStateTable[ghostIndex] == newState)
    {
        return;
    }
    
    //  まずはアニメーションの先頭に戻す
    ghostAnimStateTable[ghostIndex] = newState;
    ghostSpriteTable.frame = GHOST_ANIM_NUM[GHOST_STATE_ATTACK] * ghostAnimStateTable[ghostIndex];   //  攻撃アニメーションが横幅最大
    ghostAnimNowIndexTable[ghostIndex] = 0; 
    ghostAnimWaitTable[ghostIndex] = GHOST_ATTACK_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]];
    switch(ghostAnimStateTable[ghostIndex])
    {
        case 1:
            ghostAnimWaitTable[ghostIndex] = GHOST_MOVE_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]];
        break;
        case 2:
            ghostAnimWaitTable[ghostIndex] = GHOST_ENTRY_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]];
        break;
        case 3:
            ghostAnimWaitTable[ghostIndex] = GHOST_WAIT_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]];
        break;
    }
    ghostSpriteTable[ghostIndex].frame = GHOST_ANIM_NUM[GHOST_STATE_ATTACK] * ghostAnimStateTable[ghostIndex] + ghostAnimNowIndexTable[ghostIndex];
 
}

//  プレイヤーのアニメーション
function animGhost()
{
    for(var ghostIndex = 0; ghostIndex < GHOST_MAX; ghostIndex++)
    {
        //  アニメーション情報を更新
        ghostAnimWaitTable[ghostIndex]--;
        //  切り替えタイミングか？
        if (ghostAnimWaitTable[ghostIndex] <= 0)
        {
            ghostAnimNowIndexTable[ghostIndex]++;
            //  最後までアニメーションさせた？
            if (ghostAnimNowIndexTable[ghostIndex] >= GHOST_ANIM_NUM[ghostAnimStateTable[ghostIndex]])
            {
                //  最初に戻る
                ghostAnimNowIndexTable[ghostIndex] = 0;
                //  攻撃アニメーションなら
                if (ghostAnimStateTable[ghostIndex] == GHOST_STATE_ATTACK)
                {
                    changeGhostAnim(ghostIndex, GHOST_STATE_WAIT);    //  通常パターンに戻す   
                }
            }

            //  ウェイト情報を確認
            ghostAnimWaitTable[ghostIndex] = GHOST_ATTACK_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]];
            switch(ghostAnimStateTable[ghostIndex])
            {
                case 1:
                    ghostAnimWaitTable[ghostIndex] = GHOST_MOVE_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]];
                break;
                case 2:
                    ghostAnimWaitTable[ghostIndex] = GHOST_ENTRY_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]];
                break;
                case 3:
                    ghostAnimWaitTable[ghostIndex] = GHOST_WAIT_ANIM_TABLE[ghostAnimNowIndexTable[ghostIndex]];
                break;
            }
            ghostSpriteTable[ghostIndex].frame = GHOST_ANIM_NUM[GHOST_STATE_ATTACK] * ghostAnimStateTable[ghostIndex] + ghostAnimNowIndexTable[ghostIndex];
        }
    }
}

//  お化けのスプライトを削除
function removeGhostSprite()
{
    for(var ghostIndex = 0; ghostIndex < GHOST_MAX; ghostIndex++){
        ghostSpriteTable[ghostIndex].parentNode.removeChild(ghostSpriteTable[ghostIndex]);             
    }
}


//------------------------------------------------------------------------------------------------------------------
//  ゲーム中の背景にいる賑やかしお化けエフェクト
//------------------------------------------------------------------------------------------------------------------
var GHOST_EFFECT_MAX = 8;
var GhostEffect;
var GohstEffectDircX;
var GohstEffectDircY;
var GohstEffectSpeed;
var GhostEffectAlphaDirc;
var GhostEffectAlphaSpeed = 0.01;
var GhostEffectAlphaMin = 0.2;
var GhostEffectAlphaMax = 1.0;

//  エフェクトお化けの移動
function moveEffectGhost() {
    for(var ghostIndex = 0; ghostIndex < GHOST_EFFECT_MAX; ghostIndex++){
        //  座標更新
        GhostEffect[ghostIndex].x += GohstEffectDircX[ghostIndex] * GohstEffectSpeed[ghostIndex];
        GhostEffect[ghostIndex].y += GohstEffectDircY[ghostIndex] * GohstEffectSpeed[ghostIndex];
              
        //  透明度更新
        GhostEffect[ghostIndex].opacity += GhostEffectAlphaDirc[ghostIndex] * GhostEffectAlphaSpeed;
        //  透明度チェック
        if (GhostEffect[ghostIndex].opacity > GhostEffectAlphaMax) {
            GhostEffectAlphaDirc[ghostIndex] = -1;
        } 
        if (GhostEffect[ghostIndex].opacity < GhostEffectAlphaMin) {
            GhostEffectAlphaDirc[ghostIndex] = 1;
        } 

        //  画面外チェック
        if (GhostEffect[ghostIndex].x < -64 || GhostEffect[ghostIndex].x > WIDTH + 64) {
            //  画面外なら初期化
            calcEffectGhostPosition(ghostIndex);
        }
    }   
}

//  エフェクトお化けの移動情報を初期化
function calcEffectGhostPosition(index) {    
    //  移動方向を決める    
    GohstEffectDircX[index] = 1;
    GhostEffect[index].scaleX = - 1;
    if (rand(0, 100) < 50){
        GohstEffectDircX[index] = -1;   
        GhostEffect[index].scaleX = 1;
    }
    
    //  移動速度を決める
    GohstEffectDircY[index] = rand(-10, 10) / 100;
    GohstEffectSpeed[index] = rand(1, 2);
    
    //  透明度のアニメーションを決める
    GhostEffectAlphaDirc[index] = 1;
    if (rand(0, 100) < 50){
        GhostEffectAlphaDirc[index] = -1;     
    }

    //  透明度の初期値を決める
    GhostEffect[index].opacity = rand(0.3, 0.8);
}

//  エフェクトお化けの初期化
function initEffectGhost(scene)
{
	GhostEffect = new Array(GHOST_EFFECT_MAX);
    GohstEffectDircX = new Array(GHOST_EFFECT_MAX);
    GohstEffectDircY = new Array(GHOST_EFFECT_MAX);
    GohstEffectSpeed = new Array(GHOST_EFFECT_MAX);
    GhostEffectAlphaDirc = new Array(GHOST_EFFECT_MAX);
    
    for(var ghostIndex = 0; ghostIndex < GHOST_EFFECT_MAX; ghostIndex++){
        GhostEffect[ghostIndex] = new Sprite(game.assets[ GHOST_EFFECT ].width,game.assets[ GHOST_EFFECT ].height);
        GhostEffect[ghostIndex].image = game.assets[ GHOST_EFFECT ];
        scene.addChild( GhostEffect[ghostIndex] );        

        calcEffectGhostPosition(ghostIndex);

        //  最初の配置だけはバラけされる
        GhostEffect[ghostIndex].x = rand(0, WIDTH);
        GhostEffect[ghostIndex].y = ghostIndex * 48 + 32;
    }
}

//------------------------------------------------------------------------------------------------------------------
//  木箱の破壊、アイテム取得時のスコア表示
//------------------------------------------------------------------------------------------------------------------
var SCORE_INFO_MAX = 30;
var SCORE_INFO_WIDTH = 60;
var SCORE_INFO_HEIGHT = 42;
var SCORE_INFO_DISP_TIME = 15;
var SCORE_INFO_MOVE_SPEED = -2;

var scoreInfoIsUseTable;        //  使用しているかどうか？
var scoreInfoSpriteTable;       //  壊れた木箱
var scoreInfoSpriteFrameTable;  //  どれを表示しているか？
var scoreInfoTimeTable;         //  消すまでの時間
var scoreInfoXTable;            //  X座標保存
var scoreInfoYTable;            //  Y座標保存

//  スコアプラス情報の初期化
function initScoreInfo()
{
    scoreInfoIsUseTable = new Array(SCORE_INFO_MAX);
    scoreInfoSpriteTable = new Array(SCORE_INFO_MAX);
    scoreInfoSpriteFrameTable = new Array(SCORE_INFO_MAX);
    scoreInfoTimeTable = new Array(SCORE_INFO_MAX);  
    scoreInfoXTable = new Array(SCORE_INFO_MAX);  
    scoreInfoYTable = new Array(SCORE_INFO_MAX);  

    for(var scoreIndex = 0; scoreIndex < SCORE_INFO_MAX; scoreIndex++)
    {
       scoreInfoIsUseTable[scoreIndex] = 0;
    }
}

//  スコアプラスアニメーションの登録
function entryScoreInfo(scene, x, y, frame)
{
    var addScoreTable = [100, 200, 400];

    for(var scoreIndex = 0; scoreIndex < SCORE_INFO_MAX; scoreIndex++)
    {
        //  空いている場所を探す
        if (scoreInfoIsUseTable[scoreIndex] == 0)
        {
            //  使用中にする
            scoreInfoIsUseTable[scoreIndex] = 1;
            //  座標情報を保存
            scoreInfoXTable[scoreIndex] = x;
            scoreInfoYTable[scoreIndex] = y;
            //  アニメーション情報を初期化

            //  もしスコアアップ効果が発動してたら変更
            if (isItemBuffOn == 1 && itemBuffType == 0)
            {
                frame++;
            }
            
            //  分かりにくいけどここでスコアを加算
            addScore(addScoreTable[frame])            
            
            scoreInfoSpriteFrameTable[scoreIndex] = frame;
            scoreInfoTimeTable[scoreIndex] = SCORE_INFO_DISP_TIME;  
            //  スプライト情報を初期化
            scoreInfoSpriteTable[scoreIndex] = new Sprite(SCORE_INFO_WIDTH, SCORE_INFO_HEIGHT);
            scoreInfoSpriteTable[scoreIndex].image = game.assets[ UI_SCORE ];
            scoreInfoSpriteTable[scoreIndex].x = scoreInfoXTable[scoreIndex];
            scoreInfoSpriteTable[scoreIndex].y = scoreInfoYTable[scoreIndex];
            scoreInfoSpriteTable[scoreIndex].frame = frame;
            scene.addChild( scoreInfoSpriteTable[scoreIndex] );
            return;
        }
    }    
}

//  スコアプラススプライトのリムーブ
function removeScoreInfo()
{
    for(var scoreIndex = 0; scoreIndex < SCORE_INFO_MAX; scoreIndex++)
    {
        if (scoreInfoIsUseTable[scoreIndex] == 1)
        {
    		scoreInfoSpriteTable[scoreIndex].parentNode.removeChild(scoreInfoSpriteTable[scoreIndex]);
        }
    }    
}

//  スコアプラススプライトの復活
function resumeScoreInfo(scene)
{
    for(var scoreIndex = 0; scoreIndex < SCORE_INFO_MAX; scoreIndex++)
    {
        if (scoreInfoIsUseTable[scoreIndex] == 1)
        {
            //  スプライト情報を初期化
            scoreInfoSpriteTable[scoreIndex] = new Sprite(SCORE_INFO_WIDTH, SCORE_INFO_HEIGHT);
            scoreInfoSpriteTable[scoreIndex].image = game.assets[ UI_SCORE ];
            scoreInfoSpriteTable[scoreIndex].x = scoreInfoXTable[scoreIndex];
            scoreInfoSpriteTable[scoreIndex].y = scoreInfoYTable[scoreIndex];
            scoreInfoSpriteTable[scoreIndex].frame = scoreInfoSpriteFrameTable[scoreIndex]; 
            //  Opacityを更新
            scoreInfoSpriteTable[scoreIndex].opacity = scoreInfoTimeTable[scoreIndex] / SCORE_INFO_DISP_TIME;
           
            scene.addChild( scoreInfoSpriteTable[scoreIndex] );
        }
    }    
}

//  スコアプラスアニメーション(座標更新のみ)
function animScoreInfo()
{
    for(var scoreIndex = 0; scoreIndex < SCORE_INFO_MAX; scoreIndex++)
    {
        //  使っている場所を探す
        if (scoreInfoIsUseTable[scoreIndex] == 1)
        {
            //  座標を更新
            scoreInfoYTable[scoreIndex] += SCORE_INFO_MOVE_SPEED;
            scoreInfoSpriteTable[scoreIndex].y = scoreInfoYTable[scoreIndex];
            //  Opacityを更新
            scoreInfoSpriteTable[scoreIndex].opacity = scoreInfoTimeTable[scoreIndex] / SCORE_INFO_DISP_TIME;
            //  アニメーション情報を更新
            scoreInfoTimeTable[scoreIndex]--;
            //  切り替えタイミングか？
            if (scoreInfoTimeTable[scoreIndex] <= 0)
            {
                //  消去
                scoreInfoIsUseTable[scoreIndex] = 0;
                scoreInfoSpriteTable[scoreIndex].parentNode.removeChild(scoreInfoSpriteTable[scoreIndex]);
            }
        }
    }    
}

//------------------------------------------------------------------------------------------------------------------
//  アイテムのキラキラエフェクト
//------------------------------------------------------------------------------------------------------------------
var ITEM_EFFECT_MAX = 30;
var ITEM_EFFECT_WIDTH = 64;
var ITEM_EFFECT_HEIGHT = 64;
var ITEM_EFFECT_ANIM_NUM = 7;
var ITEM_EFFECT_ANIM_TABLE = [4,4,4,4,4,4,4];   //  コマを表示する時間

var itemEffectIsUse;        //  使用しているかどうか？
var itemEffectSpriteTable;     //  キラキラエフェクト
var itemEffectAnimWaitTable; //  現在のウエイト値
var itemEffectNowIndexTable; //  現在のパターン番号
var itemEffectXTable;            //  X座標保存
var itemEffectYTable;            //  Y座標保存
var itemEffectMapXTable;         //  X座標保存
var itemEffectMapYTable;         //  Y座標保存

//  キラキラエフェクトアニメーション情報の初期化
function initItemEffect()
{
    itemEffectIsUse = new Array(ITEM_EFFECT_MAX);
    itemEffectSpriteTable = new Array(ITEM_EFFECT_MAX);
    itemEffectAnimWaitTable = new Array(ITEM_EFFECT_MAX);
    itemEffectNowIndexTable = new Array(ITEM_EFFECT_MAX);  
    itemEffectXTable = new Array(ITEM_EFFECT_MAX);  
    itemEffectYTable = new Array(ITEM_EFFECT_MAX);  
    itemEffectMapXTable = new Array(ITEM_EFFECT_MAX);  
    itemEffectMapYTable = new Array(ITEM_EFFECT_MAX);  

    for(var itemIndex = 0; itemIndex < ITEM_EFFECT_MAX; itemIndex++)
    {
       itemEffectIsUse[itemIndex] = 0;
    }
}

//  キラキラエフェクトアニメーションの登録
function entryItemEffect(scene, x, y, mapX, mapY)
{
    for(var itemIndex = 0; itemIndex < ITEM_EFFECT_MAX; itemIndex++)
    {
        //  空いている場所を探す
        if (itemEffectIsUse[itemIndex] == 0)
        {
            //  使用中にする
            itemEffectIsUse[itemIndex] = 1;
            //  座標情報を保存
            itemEffectXTable[itemIndex] = x;
            itemEffectYTable[itemIndex] = y;
            itemEffectMapXTable[itemIndex] = mapX;
            itemEffectMapYTable[itemIndex] = mapY;
            //  アニメーション情報を初期化
            itemEffectNowIndexTable[itemIndex] = 0;
            itemEffectAnimWaitTable[itemIndex] = ITEM_EFFECT_ANIM_TABLE[itemEffectNowIndexTable[itemIndex]];  
            //  スプライト情報を初期化
            itemEffectSpriteTable[itemIndex] = new Sprite(ITEM_EFFECT_WIDTH, ITEM_EFFECT_WIDTH);
            itemEffectSpriteTable[itemIndex].image = game.assets[ ITEM_EFFECT ];
            itemEffectSpriteTable[itemIndex].x = itemEffectXTable[itemIndex];
            itemEffectSpriteTable[itemIndex].y = itemEffectYTable[itemIndex];
            itemEffectSpriteTable[itemIndex].frame = itemEffectNowIndexTable[itemIndex];
            scene.addChild( itemEffectSpriteTable[itemIndex] );
            return;
        }
    }    
}

//  キラキラエフェクトスプライトのリムーブ
function removeItemEffect()
{
    for(var itemIndex = 0; itemIndex < ITEM_EFFECT_MAX; itemIndex++)
    {
        if (itemEffectIsUse[itemIndex] == 1)
        {
    		itemEffectSpriteTable[itemIndex].parentNode.removeChild(itemEffectSpriteTable[itemIndex]);
        }
    }    
}

//  キラキラエフェクトスプライトのリムーブ
function removeItemEffectFromXY(x,y)
{
    for(var itemIndex = 0; itemIndex < ITEM_EFFECT_MAX; itemIndex++)
    {
        if (itemEffectIsUse[itemIndex] == 1)
        {
            if (itemEffectMapXTable[itemIndex] == x && itemEffectMapYTable[itemIndex] == y)
            {
                itemEffectIsUse[itemIndex] = 0;
                itemEffectSpriteTable[itemIndex].parentNode.removeChild(itemEffectSpriteTable[itemIndex]);
            }
        }
    }    
}

//  キラキラエフェクトスプライトの復活
function resumeItemEffect(scene)
{
    for(var itemIndex = 0; itemIndex < ITEM_EFFECT_MAX; itemIndex++)
    {
        if (itemEffectIsUse[itemIndex] == 1)
        {
            //  スプライト情報を初期化
            itemEffectSpriteTable[itemIndex] = new Sprite(ITEM_EFFECT_WIDTH, ITEM_EFFECT_WIDTH);
            itemEffectSpriteTable[itemIndex].image = game.assets[ ITEM_EFFECT ];
            itemEffectSpriteTable[itemIndex].x = itemEffectXTable[itemIndex];
            itemEffectSpriteTable[itemIndex].y = itemEffectYTable[itemIndex];
            itemEffectSpriteTable[itemIndex].frame = itemEffectNowIndexTable[itemIndex];            
            scene.addChild( itemEffectSpriteTable[itemIndex] );
        }
    }    
}

//  キラキラエフェクトアニメーション
function animItemEffect()
{
    for(var itemIndex = 0; itemIndex < ITEM_EFFECT_MAX; itemIndex++)
    {
        //  使っている場所を探す
        if (itemEffectIsUse[itemIndex] == 1)
        {
            //  アニメーション情報を更新
            itemEffectAnimWaitTable[itemIndex]--;
            itemEffectSpriteTable[itemIndex].x = itemEffectXTable[itemIndex];
            itemEffectSpriteTable[itemIndex].y = itemEffectYTable[itemIndex];
            //  切り替えタイミングか？
            if (itemEffectAnimWaitTable[itemIndex] <= 0)
            {
                itemEffectNowIndexTable[itemIndex]++;
                if (itemEffectNowIndexTable[itemIndex] >= ITEM_EFFECT_ANIM_NUM)
                {
                    itemEffectNowIndexTable[itemIndex] = 0;
                }
                itemEffectSpriteTable[itemIndex].frame = itemEffectNowIndexTable[itemIndex];
                itemEffectAnimWaitTable[itemIndex] = ITEM_EFFECT_ANIM_TABLE[itemEffectNowIndexTable[itemIndex]];                    
            }
        }
    }    
}

//  キラキラエフェクトスプライトの座標更新
function addItemEffectPos()
{
    for(var itemIndex = 0; itemIndex < ITEM_EFFECT_MAX; itemIndex++)
    {
        if (itemEffectIsUse[itemIndex] == 1)
        {
            itemEffectXTable[itemIndex] += scrollX;
            itemEffectYTable[itemIndex] += scrollY;
        }
    }    
}

function setItemEffectPos(mapX, mapY, x, y)
{
    for(var itemIndex = 0; itemIndex < ITEM_EFFECT_MAX; itemIndex++)
    {
        if (itemEffectIsUse[itemIndex] == 1)
        {
            if (itemEffectMapXTable[itemIndex] == mapX && itemEffectMapYTable[itemIndex] == mapY)
            {
                itemEffectXTable[itemIndex] = x;
                itemEffectYTable[itemIndex] = y;
                itemEffectSpriteTable[itemIndex].x = itemEffectXTable[itemIndex];
                itemEffectSpriteTable[itemIndex].y = itemEffectYTable[itemIndex];
            }
        }
    }    
}


//------------------------------------------------------------------------------------------------------------------
//  木箱の破壊
//------------------------------------------------------------------------------------------------------------------
var BREAK_BLOCK_MAX = 30;
var BREAK_BLOCK_WIDTH = 512;
var BREAK_BLOCK_HEIGHT = 460;
var BREAK_BLOCK_ANIM_NUM = 7;
var BREAK_BLOCK_ANIM_TABLE = [2,2,2,2,2,2,2];   //  コマを表示する時間

var breakBlockIsUse;        //  使用しているかどうか？
var breakBlockSprite;     //  壊れた木箱
var breakBlockAnimWait; //  現在のウエイト値
var breakBlockNowIndex; //  現在のパターン番号
var breakBlockX;            //  ブロックのX座標保存
var breakBlockY;            //  ブロックのY座標保存
var breakBlockMapX;         //  ブロックのマップX座標保存
var breakBlockMapY;         //  ブロックのマップY座標保存

//  木箱の破壊アニメーション情報の初期化
function initBreakBlock()
{
    breakBlockIsUse = new Array(BREAK_BLOCK_MAX);
    breakBlockSprite = new Array(BREAK_BLOCK_MAX);
    breakBlockAnimWait = new Array(BREAK_BLOCK_MAX);
    breakBlockNowIndex = new Array(BREAK_BLOCK_MAX);  
    breakBlockX = new Array(BREAK_BLOCK_MAX);  
    breakBlockY = new Array(BREAK_BLOCK_MAX);  
    breakBlockMapX = new Array(BREAK_BLOCK_MAX);  
    breakBlockMapY = new Array(BREAK_BLOCK_MAX);  

    for(var breakIndex = 0; breakIndex < BREAK_BLOCK_MAX; breakIndex++)
    {
       breakBlockIsUse[breakIndex] = 0;
    }
}

//  木箱の破壊アニメーションの登録
function entryBreakBlock(scene, x, y, mapX, mapY)
{
    addBreakBlockCount();
    var sound = game.assets[SE_BREAK].clone();
    sound.play();

    for(var breakIndex = 0; breakIndex < BREAK_BLOCK_MAX; breakIndex++)
    {
        //  空いている場所を探す
        if (breakBlockIsUse[breakIndex] == 0)
        {
            //  使用中にする
            breakBlockIsUse[breakIndex] = 1;
            //  座標情報を保存
            breakBlockX[breakIndex] = x;
            breakBlockY[breakIndex] = y;
            breakBlockMapX[breakIndex] = mapX;
            breakBlockMapY[breakIndex] = mapY;
            //  アニメーション情報を初期化
            breakBlockNowIndex[breakIndex] = 0;
            breakBlockAnimWait[breakIndex] = BREAK_BLOCK_ANIM_TABLE[breakBlockNowIndex[breakIndex]];  
            //  スプライト情報を初期化
            breakBlockSprite[breakIndex] = new Sprite(BREAK_BLOCK_WIDTH, BREAK_BLOCK_HEIGHT);
            breakBlockSprite[breakIndex].image = game.assets[ BREAK_BLOCK ];
            breakBlockSprite[breakIndex].x = breakBlockX[breakIndex];
            breakBlockSprite[breakIndex].y = breakBlockY[breakIndex];
            breakBlockSprite[breakIndex].frame = breakBlockNowIndex[breakIndex];
            scene.addChild( breakBlockSprite[breakIndex] );
            return;
        }
    }    
}

//  木箱破壊スプライトのリムーブ
function removeBreakBlock()
{
    for(var breakIndex = 0; breakIndex < BREAK_BLOCK_MAX; breakIndex++)
    {
        if (breakBlockIsUse[breakIndex] == 1)
        {
    		breakBlockSprite[breakIndex].parentNode.removeChild(breakBlockSprite[breakIndex]);
        }
    }    
}

//  木箱破壊スプライトの復活
function resumeBreakBlock(scene)
{
    for(var breakIndex = 0; breakIndex < BREAK_BLOCK_MAX; breakIndex++)
    {
        if (breakBlockIsUse[breakIndex] == 1)
        {
            //  スプライト情報を初期化
            breakBlockSprite[breakIndex] = new Sprite(BREAK_BLOCK_WIDTH, BREAK_BLOCK_HEIGHT);
            breakBlockSprite[breakIndex].image = game.assets[ BREAK_BLOCK ];
            breakBlockSprite[breakIndex].x = breakBlockX[breakIndex];
            breakBlockSprite[breakIndex].y = breakBlockY[breakIndex];
            breakBlockSprite[breakIndex].frame = breakBlockNowIndex[breakIndex];            
            scene.addChild( breakBlockSprite[breakIndex] );
        }
    }    
}

//  木箱の破壊アニメーション
function animBreakBlock()
{
    for(var breakIndex = 0; breakIndex < BREAK_BLOCK_MAX; breakIndex++)
    {
        //  使っている場所を探す
        if (breakBlockIsUse[breakIndex] == 1)
        {
            //  アニメーション情報を更新
            breakBlockAnimWait[breakIndex]--;
            breakBlockSprite[breakIndex].x = breakBlockX[breakIndex];
            breakBlockSprite[breakIndex].y = breakBlockY[breakIndex];
            //  切り替えタイミングか？
            if (breakBlockAnimWait[breakIndex] <= 0)
            {
                breakBlockNowIndex[breakIndex]++;
                //  最後までアニメーションさせた？
                if (breakBlockNowIndex[breakIndex] >= BREAK_BLOCK_ANIM_NUM)
                {
                    //  消去
                    breakBlockIsUse[breakIndex] = 0;
                    breakBlockSprite[breakIndex].parentNode.removeChild(breakBlockSprite[breakIndex]);
                } else {
                    breakBlockSprite[breakIndex].frame++;
                    breakBlockNowIndex[breakIndex]++;
                    breakBlockAnimWait[breakIndex] = BREAK_BLOCK_ANIM_TABLE[breakBlockNowIndex[breakIndex]];                    
                }
            }
        }
    }    
}

function setBreakBlockPos(mapX, mapY, x, y)
{
    for(var breakIndex = 0; breakIndex < BREAK_BLOCK_MAX; breakIndex++)
    {
        if (breakBlockIsUse[breakIndex] == 1)
        {
            if (breakBlockMapX[breakIndex] == mapX && breakBlockMapY[breakIndex] == mapY)
            {
                breakBlockX[breakIndex] = x;
                breakBlockY[breakIndex] = y;
                breakBlockSprite[breakIndex].x = breakBlockX[breakIndex];
                breakBlockSprite[breakIndex].y = breakBlockY[breakIndex];
            }
        }
    }    
}

//------------------------------------------------------------------------------------------------------------------
//  プレイヤー処理
//------------------------------------------------------------------------------------------------------------------
var isClear = -1;   //  クリアしたら立つフラグ
var isGameOver = -1;   //  ゲームオーバーになったら立つフラグ

var PLAYER_WIDTH = 128;
var PLAYER_HEIGHT = 128;

var PLAYER_ANIM_NUM = [9, 6, 2, 6, 6, 6, 6, 3, 3, 3, 3];   //それぞれのアニメーションパターン毎のアニメーション枚数
var PLAYER_WAIT_ANIM_TABLE = [4, 4, 4, 4, 4, 4]; //  コマを表示する時間
var PLAYER_DAMAGE_ANIM_TABLE = [3, 3, 3, 3, 3, 3, 3, 3, 3];
var PLAYER_GOAL_ANIM_TABLE = [8, 8];
var PLAYER_WALK_ANIM_TABLE = [3, 3, 3, 3, 3, 3];
var PLAYER_ATTACK_ANIM_TABLE = [2, 2, 6];

var playerSprite;     //  プレイヤースプライト
var playerX;    //  プレイヤーのx座標
var playerY;    //  プレイヤーのy座標
var playerGoalX;    //  プレイヤーのx座標
var playerGoalY;    //  プレイヤーのy座標
var playerAnimWait; //  現在のウエイト値
var playerAnimNowIndex; //  現在のパターン番号
var playerAnimStartFrame;     //  アニメーション開始フレーム
var playerAnimState;    //  どのアニメーションをしているのか？(0...ダメージ、1...通常, 2...ゴール)
var playerGoal;         //  ゴールしているか？(0...してない, 1...してる)

var isMoving = -1;  //  移動中か？
var moveCount = 0;  //  １マスあたり滞在時間カウント
var moveGoalX = 0;
var moveGoalY = 0;
var moveOffsetX = 0;
var moveOffsetY = 0;
var MOVE_GOAL_COUNT_END = 3;
var moveGoalCount = 0;
var MOVE_WAIT = 2; //  1マスあたりの滞在時間
var nextBreakBlockX = -1;   //  移動後にブロックを壊すか？
var nextBreakBlockY = -1;

//  移動後のスプライト再設定とゴールにたどり着いたかどうかのチェックを行う
function movePlyerSub()
{
    if (playerX == playerGoalX && playerY == playerGoalY)
    {
        changePlayerAnim(1);
        isMoving = -1;
        moveGoalX = 0;
        moveGoalY = 0;
        moveGoalCount = 0;
        
        switch(stageData[playerX][playerY]){
        case 10:    //  キャンディー
        case 11:    //  メガネ
        case 12:    //  スター                 
            //  アイテムの上に乗った！アイテム効果発動！
            if (isItemBuffOn == 0)
            {
                var sound = game.assets[SE_GET].clone();
                sound.play();
                removeItemEffectFromXY(playerX, playerY);
                startItemBuff(stageData[playerX][playerY]);

                entryScoreInfo(game.currentScene, stageSprite[playerX][playerY].x + 20, stageSprite[playerX][playerY].y, 1);
                //  普通の床に変更
                stageData[playerX][playerY] = 5;
            }
            var sound = game.assets[SE_WALK].clone();
            sound.play();
            break;
        case 13:
            //  ゴールについた？
            var sound = game.assets[SE_GOAL].clone();
            sound.play();
            playerGoal = 1;
            changePlayerAnim(2);
            break;
        }
        
        if (playerGoal != 1)
        {
            var remake = breakBlock(nextBreakBlockX, nextBreakBlockY);
            if (remake == 1)
            {
                removeStageSprite();
                initStage(game.currentScene);
                return;
            }            
        } 
    }
        
    removeStageSprite();
    initStage(game.currentScene);
}

//  プレイヤーの移動
function movePlayer()
{
    if (isMoving == -1)
    {
        return -1;
    }
    
    moveCount++;
    if (moveCount >= MOVE_WAIT)
    {
        moveCount = 0;
        
        //  今のマスよりも1個小さな数字が入っている場所に移動する
        var nextID = pathData[playerX][playerY] - 1;

        //  左
        if (playerX != 0)
        {
            if (pathData[playerX - 1][playerY] == nextID)
            {
                changePlayerAnim(6);
                
                //  いきなり１マス移動するのではなくて徐々にそっちに向かう                
                //  初期設定
                if (isMoving == 1)
                {
                    moveGoalCount = 0;
                    moveGoalX = (chipWidth/2) / MOVE_GOAL_COUNT_END;
                    moveGoalY = -(chipHeight/2) / MOVE_GOAL_COUNT_END;
//                    moveGoalX = 0;
//                    moveGoalY = 0;
                    isMoving = 2;
                }
                
                //  移動
                if (isMoving == 1 || isMoving == 2)
                {
                    moveGoalCount++;
                    playerSprite.x = playerSprite.x + moveGoalX * moveGoalCount;
                    playerSprite.y = playerSprite.y + moveGoalY * moveGoalCount;
                    if (moveGoalCount >= MOVE_GOAL_COUNT_END-1)
                    {
                        isMoving = 3;
                    }
                }
                
                if (isMoving == 3)
                {
                    playerX -= 1;
                    isMoving = 1;
                    moveGoalX = 0;
                    moveGoalY = 0;
                    movePlyerSub();
                }
                return 1;                    
            }
        }
        //  右
        if (playerX <= STAGE_WIDTH - 2)
        {
            if (pathData[playerX + 1][playerY] == nextID)
            {
                changePlayerAnim(3);
                //  いきなり１マス移動するのではなくて徐々にそっちに向かう                
                //  初期設定
                if (isMoving == 1)
                {
                    moveGoalCount = 0;
                    moveGoalX = -(chipWidth/2) / MOVE_GOAL_COUNT_END;
                    moveGoalY = (chipHeight/2) / MOVE_GOAL_COUNT_END;
//                    moveGoalX = 0;
//                    moveGoalY = 0;
                    isMoving = 2;
                }
                
                //  移動
                if (isMoving == 1 || isMoving == 2)
                {
                    moveGoalCount++;
                    playerSprite.x = playerSprite.x + moveGoalX * moveGoalCount;
                    playerSprite.y = playerSprite.y + moveGoalY * moveGoalCount;
                    if (moveGoalCount >= MOVE_GOAL_COUNT_END)
                    {
                        isMoving = 3;
                    }
                }
                
                if (isMoving == 3)
                {
                    playerX += 1;
                    isMoving = 1;
                    moveGoalX = 0;
                    moveGoalY = 0;
                    movePlyerSub();
                }
                return 1;
            }
        }
        //  上
        if (playerY != 0)
        {
            if (pathData[playerX][playerY - 1] == nextID)
            {
                changePlayerAnim(4);
                //  いきなり１マス移動するのではなくて徐々にそっちに向かう                
                //  初期設定
                if (isMoving == 1)
                {
                    moveGoalCount = 0;
                    moveGoalX = -(chipWidth/2) / MOVE_GOAL_COUNT_END;
                    moveGoalY = -(chipHeight/2) / MOVE_GOAL_COUNT_END;
//                    moveGoalX = 0;
//                    moveGoalY = 0;
                    isMoving = 2;
                }
                
                //  移動
                if (isMoving == 1 || isMoving == 2)
                {
                    moveGoalCount++;
                    playerSprite.x = playerSprite.x + moveGoalX * moveGoalCount;
                    playerSprite.y = playerSprite.y + moveGoalY * moveGoalCount;
                    if (moveGoalCount >= MOVE_GOAL_COUNT_END)
                    {
                        isMoving = 3;
                    }
                }
                
                if (isMoving == 3)
                {
                    playerY -= 1;
                    isMoving = 1;
                    moveGoalX = 0;
                    moveGoalY = 0;
                    movePlyerSub();
                }
                return 1;
            }
        }
        //  下
        if (playerY <= STAGE_WIDTH - 2)
        {
            if (pathData[playerX][playerY + 1] == nextID)
            {
                changePlayerAnim(5);
                //  いきなり１マス移動するのではなくて徐々にそっちに向かう                
                //  初期設定
                if (isMoving == 1)
                {
                    moveGoalCount = 0;
                    moveGoalX = (chipWidth/2) / MOVE_GOAL_COUNT_END;
                    moveGoalY = (chipHeight/2) / MOVE_GOAL_COUNT_END;
                    isMoving = 2;
                }
                
                //  移動
                if (isMoving == 1 || isMoving == 2)
                {
                    moveGoalCount++;
                    playerSprite.x = playerSprite.x + moveGoalX * moveGoalCount;
                    playerSprite.y = playerSprite.y + moveGoalY * moveGoalCount;
//                    moveGoalX = 0;
//                    moveGoalY = 0;
                    if (moveGoalCount >= MOVE_GOAL_COUNT_END)
                    {
                        isMoving = 3;
                    }
                }
                
                if (isMoving == 3)
                {
                    playerY += 1;
                    isMoving = 1;
                    moveGoalX = 0;
                    moveGoalY = 0;
                    movePlyerSub();
                }
                return 1;
            }
        }
        
    }
    
    return -1;
}

//  プレイヤーアニメーションの初期化
function initAnimPlayer()
{
    playerAnimState = 1;
    playerAnimNowIndex = 0; 
    playerAnimWait = PLAYER_WAIT_ANIM_TABLE[playerAnimNowIndex];
}

//  プレイヤーのアニメーションを切り替える
function changePlayerAnim(newState)
{
    if (playerAnimState == newState)
    {
        return;
    }

    var reset = 1;    
    //  歩きパターン同士の切り替えの場合はそのまま切り替えてみる
    if (playerAnimState == 3 || playerAnimState == 4 || playerAnimState == 5|| playerAnimState == 6)
    {
        if (newState == 3 || newState == 4 || newState == 5|| newState == 6)
        {
            reset = -1;
        }
    }
    
    //  まずはアニメーションの先頭に戻す
    if (reset == 1)
    {
        playerAnimNowIndex = 0; 
        playerAnimWait = PLAYER_WAIT_ANIM_TABLE[playerAnimNowIndex];
    }
    playerAnimState = newState;

    switch(playerAnimState)
    {
        case 0:
            playerAnimWait = PLAYER_WAIT_ANIM_TABLE[playerAnimNowIndex];
        break;
        case 1:
            playerAnimWait = PLAYER_DAMAGE_ANIM_TABLE[playerAnimNowIndex];
        break;
        case 2:
            playerAnimWait = PLAYER_GOAL_ANIM_TABLE[playerAnimNowIndex];
        break;
        case 3: //  歩き
        case 4:
        case 5:
        case 6:
            playerAnimWait = PLAYER_WALK_ANIM_TABLE[playerAnimNowIndex];
        break;
        case 7: //  壊す
        case 8:
        case 9:
        case 10:
            playerAnimWait = PLAYER_ATTACK_ANIM_TABLE[playerAnimNowIndex];
        break;
    }
    playerSprite.frame = PLAYER_ANIM_NUM[0] * playerAnimState + playerAnimNowIndex;

    //  壊しアニメーションは歩きの一部を利用
    if (playerAnimState >= 7)
    {
        playerSprite.frame = PLAYER_ANIM_NUM[0] * (playerAnimState - 4) + (playerAnimNowIndex + 1);      
    }
 
}

//  プレイヤーのアニメーション
function animPlayer()
{
    //  アニメーション情報を更新
    playerAnimWait--;
    //  切り替えタイミングか？
    if (playerAnimWait <= 0)
    {
        playerAnimNowIndex++;
        //  最後までアニメーションさせた？
        if (playerAnimNowIndex >= PLAYER_ANIM_NUM[playerAnimState])
        {
            //  最初に戻る
            playerAnimNowIndex = 0;
            //  驚きのパターンか壊しパターンか？
            if (playerAnimState == 0 || playerAnimState >= 7)
            {
                //  もしライフが0なら驚きのパターンのままとする
                if (lifeCount == 0)
                {
                  playerAnimNowIndex = PLAYER_ANIM_NUM[playerAnimState] - 1;
                  isGameOver = 1;                  
                } else{
                    changePlayerAnim(1);    //  通常パターンに戻す                       
                }
            }
            //  ゴールした！
            if (playerAnimState == 2)
            {
                  isClear++;                  
            }
        }

        //  ウェイト情報を確認
       playerAnimWait = PLAYER_WAIT_ANIM_TABLE[playerAnimNowIndex];
        switch(playerAnimState)
        {
            case 0:
                playerAnimWait = PLAYER_DAMAGE_ANIM_TABLE[playerAnimNowIndex];
            break;
            case 2:
                playerAnimWait = PLAYER_GOAL_ANIM_TABLE[playerAnimNowIndex];
            break;
            case 3:
            case 4:
            case 5:
            case 6:
                playerAnimWait = PLAYER_WALK_ANIM_TABLE[playerAnimNowIndex];
            break;
            case 7: //  壊す
            case 8:
            case 9:
            case 10:
                playerAnimWait = PLAYER_ATTACK_ANIM_TABLE[playerAnimNowIndex];
            break;
        }
        playerSprite.frame = PLAYER_ANIM_NUM[0] * playerAnimState + playerAnimNowIndex;
        //  壊しアニメーションは歩きの一部を利用
        if (playerAnimState >= 7)
        {
            playerSprite.frame = PLAYER_ANIM_NUM[0] * (playerAnimState - 4) + (playerAnimNowIndex + 1);      
        }
    }
}

//------------------------------------------------------------------------------------------------------------------
//  スタート！表示
//------------------------------------------------------------------------------------------------------------------

var startSprite;            //  スタート！のスプライト
var isStartAnimPlaying = 0; //  スタート！表示中か？　1なら表示中
var START_ANIM_WAIT_MAX = 40;   //  スタートのアニメを表示する長さ
var startAnimWait = 0;
var startAnimState = 0;
var startAnimTime = 0;  //  補間のための使用する時間変数

//  スタート！情報の初期化
function initStartLogoAnim(scene)
{
    isStartAnimPlaying = 0; //  スタート！表示中か？　1なら表示中
    startAnimState = 0;
    startAnimWait = START_ANIM_WAIT_MAX;
    if (gameLevel == 0)
    {   
        startSprite = new Sprite(game.assets[ START_LOGO2 ].width,game.assets[ START_LOGO2 ].height);
        startSprite.image = game.assets[ START_LOGO2 ];
    } else {
        startSprite = new Sprite(game.assets[ START_LOGO ].width,game.assets[ START_LOGO ].height);
        startSprite.image = game.assets[ START_LOGO ];        
    }
    startSprite.x = 0;
    startSprite.y = 960 / 2 - 100;
    startSprite.opacity = 0;
    scene.addChild( startSprite );
}

window._bd_share_config={common:{bdText:"我在玩《鬼屋大冒险》，你敢来挑战我吗？",bdDesc:"我爱h5游戏源码，游戏AND源码，一个也不能少~",bdUrl:"www.52h5game.com/game/guiwudamaoxian",bdPic:""},share:[{"bdSize":16}],slide:[{bdImg:0,bdPos:"right",bdTop:100}]};with(document){0[(getElementsByTagName("head")[0]||body).appendChild(createElement("script")).src="http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion="+~(-new Date()/3600000)]};

//  スタート！アニメーション開始
function startStartLogo()
{
    isStartAnimPlaying = 1;
    startSprite.x = 0;
    startSprite.y = 960 / 2 - 100;
    startSprite.scaleY = 0;
    startAnimTime = 0;
    startAnimState = 0;
}


//  スタート！の表示とアニメーション
function animStartLogo()
{
    //  アニメーション中じゃないなら何もしない
    if (isStartAnimPlaying == 0)
    {
        return;
    }

    switch(startAnimState)
    {
        case 0: //  表示開始
        startAnimTime += 30 / 150;  //  後ろの数字がアニメーションを終わらせたいフレーム数。前の数字は固定フレーム数
        startSprite.opacity = easeOut(0, 1, startAnimTime);
        startSprite.scaleY = easeOut(0, 1, startAnimTime);
        if (startAnimTime >= 1)
        {
            var sound = game.assets[SE_START].clone();
            sound.play();
            startAnimState = 1;
            startAnimTime = 0;
        }
        break;
        case 1: //  少し見せる
        startAnimTime += 0.025;
        if (startAnimTime >= 1.5)
        {
            startAnimState = 2;
            startAnimTime = 0;
        }
        break;
        case 2: //  消していく
        startAnimTime += 30 / 150;  //  後ろの数字がアニメーションを終わらせたいフレーム数。前の数字は固定フレーム数
        startSprite.opacity = easeOut(1, 0, startAnimTime);
        startSprite.scaleY = easeOut(1, 0, startAnimTime);
        if (startAnimTime >= 1)
        {
            startAnimState = 0;
            isStartAnimPlaying = 0;
			//	BGM再生
            if(BGM.src){
                BGM.play();
                BGM.src.loop = true;
            }            
        }
        break;
    }

}

//------------------------------------------------------------------------------------------------------------------
//  ゲームの初期化
//------------------------------------------------------------------------------------------------------------------
function initGameParam(level){
	STAGE_WIDTH = STAGE_SIZE_TABLE[level];
	STAGE_HEIGHT = STAGE_SIZE_TABLE[level];
}

//------------------------------------------------------------------------------------------------------------------
//  スコア関係
//------------------------------------------------------------------------------------------------------------------
var SCORE_NUMBER_WIDTH = 42;
var SCORE_NUMBER_HEIGHT = 57;
var SCORE_NUMBER_SMALL_WIDTH = 25;
var SCORE_NUMBER_SMALL_HEIGHT = 32;

var inGameScore = 0;        //  ゲーム中のスコア。リザルトのスコアとは別
var blockBreakCount = 0;    //  ブロック破壊数

var SCORE_LENGTH_MAX = 7;
var scoreSpriteTable;

function initScore(scene)
{
    var x = 520;
    var y = 880 - AD_OFFSET;
//    inGameScore = 0;
//    blockBreakCount = 0;
    scoreSpriteTable = new Array(SCORE_LENGTH_MAX);
    
    for(var numIndex = 0; numIndex < SCORE_LENGTH_MAX; numIndex++)
    {
        //  スプライトに設定
        scoreSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_WIDTH, SCORE_NUMBER_HEIGHT);
	    scoreSpriteTable[numIndex].image = game.assets[ NUMBER ];
        scoreSpriteTable[numIndex].x = x + SCORE_NUMBER_WIDTH * numIndex;
        scoreSpriteTable[numIndex].y = y;
        scoreSpriteTable[numIndex].frame = 0;
        scoreSpriteTable[numIndex].opacity = 0;
        
        scene.addChild( scoreSpriteTable[numIndex] );   
    }     
}

//  スコアをプラスする
function addScore(add)
{
    inGameScore += add;
    if (inGameScore >= 9999999)
    {
        //  ありえないけど不正防止のため
        inGameScore = 9999999;
    }
}

//  壊したブロック数をたす
function addBreakBlockCount()
{
    blockBreakCount++;
}

//  指定された座標にスコアを表示
function dispScoreMain(score, x, y, addFrame, center)
{
    var headZero = 1;   //  左からの先頭０を隠す（非表示とする）
    var numString = score.toString(10);
    if (center == -1)
    {
        x -= (numString.length-1) * SCORE_NUMBER_WIDTH;
    }
    for(var numIndex = 0; numIndex < numString.length; numIndex++)
    {
        //  スプライトを一旦リムーブ
        scoreSpriteTable[numIndex].parentNode.removeChild(scoreSpriteTable[numIndex]);
        
        //  一旦文字列にして・・・
        var valueString = numString.charAt(numIndex);
        //  １桁だけぬきとる
        var value = parseInt(valueString, 10);

        //  ０じゃない数字がきた段階で0非常時を解除
        if (value != 0)
        {
            headZero = 0;
        }
        //  最後の１桁なら０でも表示
        if (numIndex == numString.length-1)
        {
            headZero = 0;            
        }

        //  スプライトに設定
        scoreSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_WIDTH, SCORE_NUMBER_HEIGHT);
	    scoreSpriteTable[numIndex].image = game.assets[ NUMBER ];
        scoreSpriteTable[numIndex].x = x + SCORE_NUMBER_WIDTH * numIndex;
        scoreSpriteTable[numIndex].y = y;
        scoreSpriteTable[numIndex].frame = value + addFrame;
        scoreSpriteTable[numIndex].opacity = 1;
        if (headZero == 1)
        {
            scoreSpriteTable[numIndex].opacity = 0;
        }
        
        game.currentScene.addChild( scoreSpriteTable[numIndex] );        
    }    
}

//  ゲーム中にスコアを表示
function dispScoreInGame()
{
    var x = 520;
    var y = 880 - AD_OFFSET;
    dispScoreMain(inGameScore, x, y, 10, -1);
}

var resultScore = 0;
//  リザルト中にスコアを表示
function dispScoreInResult()
{
    var x = WIDTH / 2;
    var y = 490 - 50;
    var numString = resultScore.toString(10);
    x -= (numString.length * SCORE_NUMBER_WIDTH) / 2;
    dispScoreMain(resultScore, x, y, 0, 1);
}

//  リザルト中にスコアを表示
function dispScoreInGameOver()
{
    var x = WIDTH / 2;
    var y = 550 - 60;
    var numString = resultScore.toString(10);
    x -= (numString.length * SCORE_NUMBER_WIDTH) / 2;
    dispScoreMain(resultScore, x, y, 0, 1);
}

//------------------------------------------------------------------------------------------------------------------
//  タイムボーナスを計算
//------------------------------------------------------------------------------------------------------------------
var bonusScore;
var bonusSpriteTable;
var BONUS_LENGTH_MAX = 4;

function initBonus(scene)
{
    var x = 450;
    var y = 700 - AD_OFFSET;
    bonusSpriteTable = new Array(BONUS_LENGTH_MAX);
    
    for(var numIndex = 0; numIndex < BONUS_LENGTH_MAX; numIndex++)
    {
        //  スプライトに設定
        bonusSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_SMALL_WIDTH, SCORE_NUMBER_SMALL_HEIGHT);
	    bonusSpriteTable[numIndex].image = game.assets[ NUMBER_SMALL ];
        bonusSpriteTable[numIndex].x = x + SCORE_NUMBER_SMALL_WIDTH * numIndex;
        bonusSpriteTable[numIndex].y = y;
        bonusSpriteTable[numIndex].frame = 0;
        bonusSpriteTable[numIndex].opacity = 0;
        
        scene.addChild( bonusSpriteTable[numIndex] );   
    }     
}

function dispBonusMain(x,y, addFrame)
{
    var headZero = 1;   //  左からの先頭０を隠す（非表示とする）
    var numString = bonusScore.toString(10);
    x -= (numString.length-1) * SCORE_NUMBER_SMALL_WIDTH;
    for(var numIndex = 0; numIndex < numString.length; numIndex++)
    {
        //  スプライトを一旦リムーブ
        bonusSpriteTable[numIndex].parentNode.removeChild(bonusSpriteTable[numIndex]);
        
        //  一旦文字列にして・・・
        var valueString = numString.charAt(numIndex);
        //  １桁だけぬきとる
        var value = parseInt(valueString, 10);

        //  ０じゃない数字がきた段階で0非常時を解除
        if (value != 0)
        {
            headZero = 0;
        }
        //  最後の１桁なら０でも表示
        if (numIndex == numString.length-1)
        {
            headZero = 0;            
        }

        //  スプライトに設定
        bonusSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_SMALL_WIDTH, SCORE_NUMBER_SMALL_HEIGHT);
	    bonusSpriteTable[numIndex].image = game.assets[ NUMBER_SMALL ];
        bonusSpriteTable[numIndex].x = x + SCORE_NUMBER_SMALL_WIDTH * numIndex;
        bonusSpriteTable[numIndex].y = y;
        bonusSpriteTable[numIndex].frame = value + addFrame;
        bonusSpriteTable[numIndex].opacity = 1;
        if (headZero == 1)
        {
            bonusSpriteTable[numIndex].opacity = 0;
        }
        
        game.currentScene.addChild( bonusSpriteTable[numIndex] );        
    }    
}

//  リザルトにボーナスを表示
function dispBonusInResult()
{
    var x = 590;
    var y = 654 - 50;
    dispBonusMain(x, y, 10);
}


function calcTimeBonus()
{
    var bonus = 0;
    var timeTable = [90, 60, 50, 40, 30, 25, 20, 15, 10, 5];
    var timeScore = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    var bonusIndex = -1;
    for(var timeIndex = 0; timeIndex < timeTable.length; timeIndex++)
    {
        if (timeTable[timeIndex] > inGameTime)
        {
            bonusIndex = timeIndex;
        }
    }

    if (bonusIndex != -1)
    {
        bonus = timeScore[bonusIndex];
    }
    
    //  簡単の場合はスコアが下がる
    if (gameLevel == 0)
    {
        bonus /= 2;
    }
    
    return bonus;
}


//------------------------------------------------------------------------------------------------------------------
//  タイム表示
//------------------------------------------------------------------------------------------------------------------
var inGameTime = 0;        //  ゲーム中のスコア。リザルトのスコアとは別
var secCount = 0;           //  1フレーム毎にプラス。30になったらinGameTimeをインクリメントする

var TIME_LENGTH_MAX = 3;
var timeSpriteTable;

//  時間の初期化
function initTime(scene)
{
    var x = 450;
    var y = 700 - AD_OFFSET;
//    inGameTime = 0;
    secCount = 0;
    timeSpriteTable = new Array(TIME_LENGTH_MAX);
    
    for(var numIndex = 0; numIndex < TIME_LENGTH_MAX; numIndex++)
    {
        //  スプライトに設定
        timeSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_WIDTH, SCORE_NUMBER_HEIGHT);
	    timeSpriteTable[numIndex].image = game.assets[ NUMBER ];
        timeSpriteTable[numIndex].x = x + SCORE_NUMBER_WIDTH * numIndex;
        timeSpriteTable[numIndex].y = y;
        timeSpriteTable[numIndex].frame = 0;
        timeSpriteTable[numIndex].opacity = 0;
        
        scene.addChild( timeSpriteTable[numIndex] );   
    }     
}

function initTimeInResult(scene)
{
    var x = 450;
    var y = 700 - AD_OFFSET;
//    inGameTime = 0;
    secCount = 0;
    timeSpriteTable = new Array(TIME_LENGTH_MAX);
    
    for(var numIndex = 0; numIndex < TIME_LENGTH_MAX; numIndex++)
    {
        //  スプライトに設定
        timeSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_WIDTH, SCORE_NUMBER_HEIGHT);
	    timeSpriteTable[numIndex].image = game.assets[ NUMBER ];
        timeSpriteTable[numIndex].x = x + SCORE_NUMBER_WIDTH * numIndex;
        timeSpriteTable[numIndex].y = y;
        timeSpriteTable[numIndex].frame = 0;
        timeSpriteTable[numIndex].opacity = 0;
        
        scene.addChild( timeSpriteTable[numIndex] );   
    }     
}

//  時間をプラスする
function addTime()
{
    //  スタート！の時はカウントしない
    if (isStartAnimPlaying == 1 || playerGoal == 1)
    {
        return;
    }
    secCount++;
    if (secCount >= 30)
    {
        secCount = 0;
        inGameTime++;
    }
    if (inGameTime >= 999)
    {
        inGameTime = 999;
    }
}

function dispTimeMain(x,y, addFrame, scale)
{
    var headZero = 1;   //  左からの先頭０を隠す（非表示とする）
    var numString = inGameTime.toString(10);
    x -= (numString.length-1) * SCORE_NUMBER_WIDTH;
    for(var numIndex = 0; numIndex < numString.length; numIndex++)
    {
        //  スプライトを一旦リムーブ
        timeSpriteTable[numIndex].parentNode.removeChild(timeSpriteTable[numIndex]);
        
        //  一旦文字列にして・・・
        var valueString = numString.charAt(numIndex);
        //  １桁だけぬきとる
        var value = parseInt(valueString, 10);

        //  ０じゃない数字がきた段階で0非常時を解除
        if (value != 0)
        {
            headZero = 0;
        }
        //  最後の１桁なら０でも表示
        if (numIndex == numString.length-1)
        {
            headZero = 0;            
        }

        //  スプライトに設定
        timeSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_WIDTH, SCORE_NUMBER_HEIGHT);
	    timeSpriteTable[numIndex].image = game.assets[ NUMBER ];
        timeSpriteTable[numIndex].x = x + SCORE_NUMBER_WIDTH * numIndex;
        timeSpriteTable[numIndex].y = y;
        timeSpriteTable[numIndex].frame = value + addFrame;
        timeSpriteTable[numIndex].opacity = 1;
        timeSpriteTable[numIndex].scaleX = scale;
        timeSpriteTable[numIndex].scaleY = scale;
        
        if (headZero == 1)
        {
            timeSpriteTable[numIndex].opacity = 0;
        }
        
        game.currentScene.addChild( timeSpriteTable[numIndex] );        
    }    
}

function dispTimeResult(x,y, addFrame, scale)
{
    var headZero = 1;   //  左からの先頭０を隠す（非表示とする）
    var numString = inGameTime.toString(10);
    x -= (numString.length-1) * (SCORE_NUMBER_SMALL_WIDTH * scale);
    for(var numIndex = 0; numIndex < numString.length; numIndex++)
    {
        //  スプライトを一旦リムーブ
        timeSpriteTable[numIndex].parentNode.removeChild(timeSpriteTable[numIndex]);
        
        //  一旦文字列にして・・・
        var valueString = numString.charAt(numIndex);
        //  １桁だけぬきとる
        var value = parseInt(valueString, 10);

        //  ０じゃない数字がきた段階で0非常時を解除
        if (value != 0)
        {
            headZero = 0;
        }
        //  最後の１桁なら０でも表示
        if (numIndex == numString.length-1)
        {
            headZero = 0;            
        }

        //  スプライトに設定
        timeSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_SMALL_WIDTH, SCORE_NUMBER_SMALL_HEIGHT);
	    timeSpriteTable[numIndex].image = game.assets[ NUMBER_SMALL ];
        timeSpriteTable[numIndex].x = x + (SCORE_NUMBER_SMALL_WIDTH * scale) * numIndex;
        timeSpriteTable[numIndex].y = y;
        timeSpriteTable[numIndex].frame = value + addFrame;
        timeSpriteTable[numIndex].opacity = 1;
        timeSpriteTable[numIndex].scaleX = scale;
        timeSpriteTable[numIndex].scaleY = scale;
        
        if (headZero == 1)
        {
            timeSpriteTable[numIndex].opacity = 0;
        }
        
        game.currentScene.addChild( timeSpriteTable[numIndex] );        
    }    
}

//  ゲーム中に時間を表示
function dispTimeInGame()
{
    var x = 520;
    var y = 720 - AD_OFFSET;
    dispTimeMain(x, y, 10, 1);
}

//  リザルトに時間を表示
function dispTimeInResult()
{
    var x = 570;
    var y = 654 - 19;
    dispTimeResult(x, y, 10, 0.7);
}

//------------------------------------------------------------------------------------------------------------------
//  ブロック破壊数表示
//------------------------------------------------------------------------------------------------------------------
var BREAK_BLOCK_COUNT_LENGTH_MAX = 3;
var breakBlockCountSpriteTable;

//  破壊したブロック数表示の初期化
function initBreakBlockCount(scene)
{
    var x = 520;
    var y = 586 - 55;
    breakBlockCountSpriteTable = new Array(BREAK_BLOCK_COUNT_LENGTH_MAX);
    
    for(var numIndex = 0; numIndex < BREAK_BLOCK_COUNT_LENGTH_MAX; numIndex++)
    {
        //  スプライトに設定
        breakBlockCountSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_SMALL_WIDTH, SCORE_NUMBER_SMALL_HEIGHT);
	    breakBlockCountSpriteTable[numIndex].image = game.assets[ NUMBER_SMALL ];
        breakBlockCountSpriteTable[numIndex].x = x + SCORE_NUMBER_SMALL_WIDTH * numIndex;
        breakBlockCountSpriteTable[numIndex].y = y;
        breakBlockCountSpriteTable[numIndex].frame = 0;
        breakBlockCountSpriteTable[numIndex].opacity = 0;
        
        scene.addChild( breakBlockCountSpriteTable[numIndex] );   
    }     
}

//  リザルトにブロック数を表示
function dispBreakBlockCount()
{
    var x = 590;
    var y = 586 - 35;
    var headZero = 1;   //  左からの先頭０を隠す（非表示とする）
    var numString = blockBreakCount.toString(10);
    x -= (numString.length-1) * SCORE_NUMBER_SMALL_WIDTH;
    for(var numIndex = 0; numIndex < numString.length; numIndex++)
    {
        //  スプライトを一旦リムーブ
        breakBlockCountSpriteTable[numIndex].parentNode.removeChild(breakBlockCountSpriteTable[numIndex]);
        
        //  一旦文字列にして・・・
        var valueString = numString.charAt(numIndex);
        //  １桁だけぬきとる
        var value = parseInt(valueString, 10);

        //  ０じゃない数字がきた段階で0非常時を解除
        if (value != 0)
        {
            headZero = 0;
        }
        //  最後の１桁なら０でも表示
        if (numIndex == numString.length-1)
        {
            headZero = 0;            
        }

        //  スプライトに設定
        breakBlockCountSpriteTable[numIndex] = new Sprite(SCORE_NUMBER_SMALL_WIDTH, SCORE_NUMBER_SMALL_HEIGHT);
	    breakBlockCountSpriteTable[numIndex].image = game.assets[ NUMBER_SMALL ];
        breakBlockCountSpriteTable[numIndex].x = x + SCORE_NUMBER_SMALL_WIDTH * numIndex;
        breakBlockCountSpriteTable[numIndex].y = y;
        breakBlockCountSpriteTable[numIndex].frame = value;
        breakBlockCountSpriteTable[numIndex].opacity = 1;
        if (headZero == 1)
        {
            timeSpriteTable[numIndex].opacity = 0;
        }
        
        game.currentScene.addChild( breakBlockCountSpriteTable[numIndex] );        
    }    
}
//------------------------------------------------------------------------------------------------------------------
//  アイテム
//------------------------------------------------------------------------------------------------------------------
var ITEM_WIDTH = 128;
var ITEM_HEIGHT = 128;
var ITEM_MAX_TABLE = [3, 5, 8];
var ITEM_MAX;

var candyCount;
var glassCount;
var starCount;

var candySpriteTable;      //   キャンディーのスプライト
var glassSpriteTable;      //   メガネのスプライト
var starSpriteTable;       //   スターのスプライト
var itemEffectSpriteTable;  //  アイテムのキラキラエフェクト

var isItemBuffOn = 0;           //  アイテム効果発動中か？ 0...発動していない、1...発動中
var itemBuffType = 0;           //  0...キャンディー、 1...メガネ、 2...スター
var ITEM_BUFF_TIME_MAX = 30 * 5;    //  5秒発動
var itemBuffTime = ITEM_BUFF_TIME_MAX;           //  アイテム効果発動残り時間

var itemBuffWindow;         //  効果表示用スプライト
var itemBuffTimerWindow;    //  バーの枠
var itemBuffBar;            //  バー本体

var BAR_LENGTH = 220;       //  バーの長さ

//  アイテム効果発動処理
function startItemBuff(itemID)
{    
    switch(itemID)
    {
        case 10:    //  キャンディー
            itemBuffType = 0;
            isItemBuffOn = 1;
            itemBuffTime = ITEM_BUFF_TIME_MAX;
            entryItemBuffWindow();
        break;
        case 11:    //  メガネ
            itemBuffType = 1;
            isItemBuffOn = 1;
            itemBuffTime = ITEM_BUFF_TIME_MAX;
            entryItemBuffWindow();
        break;
        case 12:    //  スター
            itemBuffType = 2;
            isItemBuffOn = 1;
            itemBuffTime = ITEM_BUFF_TIME_MAX;
            entryItemBuffWindow();
        break;
    }
    
}

//  アイテム効果表示用スプライトを登録
function entryItemBuffWindow()
{
    if (isItemBuffOn == 0)
    {
        return;
    }
    
    var x = 0;
    var y = 12;
    //  まずは文字
    switch(itemBuffType)
    {
        case 0:    //  キャンディー
			itemBuffWindow = new Sprite(game.assets[ ITEM_CANDY_WINDOW ].width, game.assets[ ITEM_CANDY_WINDOW ].height);
			itemBuffWindow.image = game.assets[ ITEM_CANDY_WINDOW ];
        break;
        case 1:    //  メガネ
			itemBuffWindow = new Sprite(game.assets[ ITEM_GLASS_WINDOW ].width, game.assets[ ITEM_GLASS_WINDOW ].height);
			itemBuffWindow.image = game.assets[ ITEM_GLASS_WINDOW ];
        break;
        case 2:    //  スター
			itemBuffWindow = new Sprite(game.assets[ ITEM_STAR_WINDOW ].width, game.assets[ ITEM_STAR_WINDOW ].height);
			itemBuffWindow.image = game.assets[ ITEM_STAR_WINDOW ];
        break;
    }
    itemBuffWindow.x = x;
    itemBuffWindow.y = y;
    game.currentScene.addChild( itemBuffWindow );

    //  ゲージの中身
    itemBuffBar = new Sprite(game.assets[ ITEM_BAR ].width, game.assets[ ITEM_BAR ].height);
	itemBuffBar.image = game.assets[ ITEM_BAR ];
    itemBuffBar.x = x + 212;
    itemBuffBar.y = y + 57;
    itemBuffBar.originX = 0;
    itemBuffBar.scaleX = BAR_LENGTH * (itemBuffTime / ITEM_BUFF_TIME_MAX);
    game.currentScene.addChild( itemBuffBar );

    //  効果が持続する時間ゲージ  
    itemBuffTimerWindow = new Sprite(game.assets[ ITEM_BAR_WINDOW ].width, game.assets[ ITEM_BAR_WINDOW ].height);
	itemBuffTimerWindow.image = game.assets[ ITEM_BAR_WINDOW ];
    itemBuffTimerWindow.x = x + 210;
    itemBuffTimerWindow.y = y + 55;
    game.currentScene.addChild( itemBuffTimerWindow );
    
}

//  バーのアニメーション
function animItemBuffWindow()
{
    
    if (isItemBuffOn == 0)
    {
        return;
    }

    itemBuffTime--;
    if (itemBuffTime < 0)
    {
        //  時間切れになったのでウィンドウを消去
        itemBuffTime = 0;
        isItemBuffOn = 0;
        itemBuffWindow.parentNode.removeChild(itemBuffWindow);        
        itemBuffBar.parentNode.removeChild(itemBuffBar);        
        itemBuffTimerWindow.parentNode.removeChild(itemBuffTimerWindow);
        if (itemBuffType == 1)
        {
            setHideGhostOpacity(0);
        }
        return;        
    }
    //  バーを描画
    itemBuffBar.scaleX = BAR_LENGTH * (itemBuffTime / ITEM_BUFF_TIME_MAX);            

    //  効果を実装
    switch(itemBuffType)
    {
        case 0:    //  キャンディー
            //  得点x2なので得点ゲット時に処理する
        break;
        case 1:    //  メガネ
            //  お化けを見えるようにする
            setHideGhostOpacity(itemBuffTime / ITEM_BUFF_TIME_MAX);
        break;
        case 2:    //  スター
        break;
    }        

}

//  アイテムのスプライトを一旦削除
function removeItemSprite()
{
    for(var candyIndex = 0; candyIndex < candyCount; candyIndex++)
    {
        candySpriteTable[candyIndex].parentNode.removeChild(candySpriteTable[candyIndex]);
    }
    for(var glassIndex = 0; glassIndex < glassCount; glassIndex++)
    {
        glassSpriteTable[glassIndex].parentNode.removeChild(glassSpriteTable[glassIndex]);
    }
    for(var starIndex = 0; starIndex < starCount; starIndex++)
    {
        starSpriteTable[starIndex].parentNode.removeChild(starSpriteTable[starIndex]);
    }
    
    //  アイテム効果発動中か？
    if (isItemBuffOn == 1)
    {
        itemBuffWindow.parentNode.removeChild(itemBuffWindow);        
        itemBuffBar.parentNode.removeChild(itemBuffBar);        
        itemBuffTimerWindow.parentNode.removeChild(itemBuffTimerWindow);        
    }
}

//  隠れているお化けの透明度を設定する
function setHideGhostOpacity(opacity)
{
    for (var x = 0; x < stageSprite.length; x++){
        for (var y = 0; y < stageSprite[x].length; y++){
            //  ゴーストがいる
            if (stageData[x][y] == 2) {
                ghostSpriteTable[ghostIndexData[x][y]].opacity = opacity * 0.5;
            }
        }
    }				    
}

//------------------------------------------------------------------------------------------------------------------
//  ライフ
//------------------------------------------------------------------------------------------------------------------
var LIFE_WIDTH = 42;
var LIFE_HEIGHT = 40;

var doInitLife = -1;    //  initLifeを行ったか？
var LIFE_MAX = 3;   //  ライフの最大数
var lifeCount = 3;  //  ライフの残数
var lifeSpriteTable;
var lifeSpriteFrameTable;   //  どのパターンを表示しているか？
var lifeSpriteXTable;       //  X座標
var lifeSpriteYTable;       //  Y座標
var lifeSpriteScaleTable;   //  スケール情報
var lifeSpriteOpacityTable;   //  スケール情報

var lifeWarnBG;     //  ライフが１である事を警告するBG
var lifeWarnOpacityDirc = 1;
var lifeWarnOpacitySpeed = 0.07;
var lifeWarnOpacityMin = 0.1;
var lifeWarnOpacityMax = 1;

//  ライフの初期化
function initLife(scene)
{
    lifeWarnOpacityDirc = 1;
    lifeWarnOpacitySpeed = 0.025;
    lifeWarnOpacityMin = 0.1;
    lifeWarnOpacityMax = 0.5;

    doInitLife = 1;
    lifeSpriteTable = new Array(LIFE_MAX);
    lifeSpriteFrameTable = new Array(LIFE_MAX);
    lifeSpriteXTable = new Array(LIFE_MAX);
    lifeSpriteYTable = new Array(LIFE_MAX);
    lifeSpriteScaleTable = new Array(LIFE_MAX);
    lifeSpriteOpacityTable = new Array(LIFE_MAX);
    
    for(var lifeIndex = 0; lifeIndex < LIFE_MAX; lifeIndex++)
    {
        lifeSpriteTable[lifeIndex] = new Sprite(LIFE_WIDTH, LIFE_HEIGHT);
        lifeSpriteTable[lifeIndex].image = game.assets[ UI_LIFE ];
        lifeSpriteTable[lifeIndex].x = 394 + lifeIndex * 62;
        lifeSpriteTable[lifeIndex].y = 960-256 + 108 - AD_OFFSET;
        lifeSpriteXTable[lifeIndex] = lifeSpriteTable[lifeIndex].x;
        lifeSpriteYTable[lifeIndex] = lifeSpriteTable[lifeIndex].y;
        lifeSpriteScaleTable[lifeIndex] = 1;
        lifeSpriteFrameTable[lifeIndex] = 0;
        lifeSpriteOpacityTable[lifeIndex] = 1;
        scene.addChild( lifeSpriteTable[lifeIndex] );                
    }		

    if (lifeCount == 2)
    {
        lifeSpriteOpacityTable[2] = 0;
        lifeSpriteFrameTable[2] = 1;        
    }
    if (lifeCount == 1)
    {
        lifeSpriteOpacityTable[2] = 0;
        lifeSpriteOpacityTable[1] = 0;
        lifeSpriteFrameTable[2] = 1;        
        lifeSpriteFrameTable[1] = 1;        
    }
    if (lifeCount == 0)
    {
        lifeSpriteOpacityTable[3] = 0;
        lifeSpriteOpacityTable[2] = 0;
        lifeSpriteOpacityTable[1] = 0;
        lifeSpriteFrameTable[3] = 1;        
        lifeSpriteFrameTable[2] = 1;        
        lifeSpriteFrameTable[1] = 1;        
    }
}

//  ライフを減らす
function damageLife()
{
    if (lifeCount == 0)
    {
        return;
    }
    lifeSpriteFrameTable[lifeCount - 1] = 1;
    lifeSpriteTable[lifeCount - 1].frame = lifeSpriteFrameTable[lifeCount - 1];
    lifeSpriteScaleTable[lifeCount - 1] = 1;
    
    lifeSpriteTable[lifeCount - 1].scaleX = lifeSpriteScaleTable[lifeCount - 1];            
    lifeSpriteTable[lifeCount - 1].scaleY = lifeSpriteScaleTable[lifeCount - 1];            
    lifeSpriteTable[lifeCount - 1].frame = lifeSpriteFrameTable[lifeCount - 1];            
   
    lifeCount--;
    if (lifeCount == 1)
    {
        lifeWarnBG = new Sprite(game.assets[ BG_LASTLIFE ].width,game.assets[ BG_LASTLIFE ].height);
        lifeWarnBG.image = game.assets[ BG_LASTLIFE ];
        lifeWarnBG.x = 0;
        lifeWarnBG.y = 0;
        lifeWarnBG.opacity = lifeWarnOpacityMin;
        game.currentScene.addChild( lifeWarnBG );
    } 

}

//  ライフスプライトのリムーブ
function removeLife()
{
    for(var lifeIndex = 0; lifeIndex < LIFE_MAX; lifeIndex++)
    {
        lifeSpriteTable[lifeIndex].parentNode.removeChild(lifeSpriteTable[lifeIndex]);
    }
    if (lifeCount == 1)
    {
        lifeWarnBG.parentNode.removeChild(lifeWarnBG);        
    }    
}

//  ライフスプライトの復活（アニメーションするので必要）
function resumeLife(scene)
{
    if (doInitLife == -1)
    {
        return;
    }
    for(var lifeIndex = 0; lifeIndex < LIFE_MAX; lifeIndex++)
    {
        //  スプライト情報を初期化
        lifeSpriteTable[lifeIndex] = new Sprite(LIFE_WIDTH, LIFE_HEIGHT);
        lifeSpriteTable[lifeIndex].image = game.assets[ UI_LIFE ];
        lifeSpriteTable[lifeIndex].x = lifeSpriteXTable[lifeIndex];
        lifeSpriteTable[lifeIndex].y = lifeSpriteYTable[lifeIndex];
        lifeSpriteTable[lifeIndex].frame = lifeSpriteFrameTable[lifeIndex];            
        lifeSpriteTable[lifeIndex].scaleX = lifeSpriteScaleTable[lifeIndex];            
        lifeSpriteTable[lifeIndex].scaleY = lifeSpriteScaleTable[lifeIndex];            
        lifeSpriteTable[lifeIndex].opacity = lifeSpriteOpacityTable[lifeIndex];            
        scene.addChild( lifeSpriteTable[lifeIndex] );
    }    

    if (lifeCount == 1)
    {
        lifeWarnBG = new Sprite(game.assets[ BG_LASTLIFE ].width,game.assets[ BG_LASTLIFE ].height);
        lifeWarnBG.image = game.assets[ BG_LASTLIFE ];
        lifeWarnBG.x = 0;
        lifeWarnBG.y = 0;
        lifeWarnBG.opacity = lifeWarnOpacityMin;
        scene.addChild( lifeWarnBG );
    } 

}

//  ライフの移動アニメーション
function animLife()
{
    for(var lifeIndex = 0; lifeIndex < LIFE_MAX; lifeIndex++)
    {
        //  ダメージ表現中
        if (lifeSpriteFrameTable[lifeIndex] == 1)
        {
            lifeSpriteOpacityTable[lifeIndex] -= 0.05;
            if (lifeSpriteOpacityTable[lifeIndex] < 0)
            {
                lifeSpriteOpacityTable[lifeIndex] = 0;              
            }
            lifeSpriteScaleTable[lifeIndex] += 0.035;
            
            lifeSpriteTable[lifeIndex].x = lifeSpriteXTable[lifeIndex];
            lifeSpriteTable[lifeIndex].y = lifeSpriteYTable[lifeIndex];
            lifeSpriteTable[lifeIndex].frame = lifeSpriteFrameTable[lifeIndex];            
            lifeSpriteTable[lifeIndex].scaleX = lifeSpriteScaleTable[lifeIndex];            
            lifeSpriteTable[lifeIndex].scaleY = lifeSpriteScaleTable[lifeIndex];            
            lifeSpriteTable[lifeIndex].opacity = lifeSpriteOpacityTable[lifeIndex];            
            
        }
    }
    
    if (lifeCount == 1)
    {
        lifeWarnBG.opacity += lifeWarnOpacityDirc * lifeWarnOpacitySpeed;
        if (lifeWarnBG.opacity < lifeWarnOpacityMin || lifeWarnBG.opacity > lifeWarnOpacityMax)
        {
            lifeWarnOpacityDirc *= -1;
        }
        
    }    
}

//------------------------------------------------------------------------------------------------------------------
//  背景生成
//------------------------------------------------------------------------------------------------------------------
var bgSprite;
var bgLeft;     //  左の崖
var bgRight;    //  右の崖

function initBG(scene)
{
    // 背景
    bgSprite = new Sprite( WIDTH, HEIGHT );
    switch(gameLevel)
    {
    case 0:
        bgSprite.image = game.assets[ BG_EASY ];
    break;
    case 1:
        bgSprite.image = game.assets[ BG_NORMAL ];
    break;
    case 2:
        bgSprite.image = game.assets[ BG_HARD ];
    break;
    }
    scene.addChild( bgSprite );

}

function initCliff(scene)
{
    switch(gameLevel)
    {
    case 0:
        //  左の壁
        bgLeft = new Sprite(game.assets[ BG_LEFT01 ].width,game.assets[ BG_LEFT01 ].height);
        bgLeft.image = game.assets[ BG_LEFT01 ];
        //  右の壁
        bgRight = new Sprite(game.assets[ BG_RIGHT01 ].width,game.assets[ BG_RIGHT01 ].height);
        bgRight.image = game.assets[ BG_RIGHT01 ];
    break;
    case 1:
        //  左の壁
        bgLeft = new Sprite(game.assets[ BG_LEFT02 ].width,game.assets[ BG_LEFT02 ].height);
        bgLeft.image = game.assets[ BG_LEFT02 ];
        //  右の壁
        bgRight = new Sprite(game.assets[ BG_RIGHT02 ].width,game.assets[ BG_RIGHT02 ].height);
        bgRight.image = game.assets[ BG_RIGHT02 ];
    break;
    case 2:
        //  左の壁
        bgLeft = new Sprite(game.assets[ BG_LEFT03 ].width,game.assets[ BG_LEFT03 ].height);
        bgLeft.image = game.assets[ BG_LEFT03 ];
        //  右の壁
        bgRight = new Sprite(game.assets[ BG_RIGHT03 ].width,game.assets[ BG_RIGHT03 ].height);
        bgRight.image = game.assets[ BG_RIGHT03 ];
    break;
    }
    
    setCliffPos();
    
    scene.addChild( bgLeft );

    scene.addChild( bgRight );    
}

function setCliffPos()
{
    switch(gameLevel)
    {
    case 0:
        //  左の壁
        bgLeft.x = 0;
        bgLeft.y = 480 - AD_OFFSET;
        //  右の壁
        bgRight.x = 320;
        bgRight.y = 480 - AD_OFFSET;
    break;
    case 1:
        //  左の壁
        bgLeft.x = -124;
        bgLeft.y = 480 + 88 - AD_OFFSET;
        //  右の壁
        bgRight.x = 320;
        bgRight.y = 480 + 88 - AD_OFFSET;
    break;
    case 2:
        //  左の壁
        bgLeft.x = -316;
        bgLeft.y = 480 + 208 - AD_OFFSET;
        //  右の壁
        bgRight.x = 320;
        bgRight.y = 480 + 208 - AD_OFFSET;
    break;
    }
}

//------------------------------------------------------------------------------------------------------------------
//  画面下のウィンドウ生成
//------------------------------------------------------------------------------------------------------------------
var infoWindow;  //  時間とライフ
var timerEffect;    //  時間の針
var timerSecText;   //  「秒」という表示
var timerRotate = 0;

function initWindow(scene)
{
    //  時間とライフウインドウ
    infoWindow = new Sprite(game.assets[ INFO_WINDOW ].width,game.assets[ INFO_WINDOW ].height);
    infoWindow.image = game.assets[ INFO_WINDOW ];
    infoWindow.x = 0;
    infoWindow.y = 960-256 - AD_OFFSET;
    scene.addChild( infoWindow );
    
    //  時間の針            
    timerEffect = new Sprite(game.assets[ INFO_WINDOW_TIMER ].width,game.assets[ INFO_WINDOW_TIMER ].height);
    timerEffect.image = game.assets[ INFO_WINDOW_TIMER ];
    timerEffect.x = 64;
    timerEffect.y = 960-256 + 34 - AD_OFFSET;
    timerEffect.rotation = timerRotate;
    scene.addChild( timerEffect );

    //  時間の針            
    timerSecText = new Sprite(game.assets[ UI_SEC ].width,game.assets[ UI_SEC ].height);
    timerSecText.image = game.assets[ UI_SEC ];
    timerSecText.x = 570;
    timerSecText.y = 960-256 + 30 - AD_OFFSET;
    scene.addChild( timerSecText );
}

function removeWindow()
{
    timerRotate = timerEffect.rotation;
    infoWindow.parentNode.removeChild(infoWindow);
    timerEffect.parentNode.removeChild(timerEffect);    
    timerSecText.parentNode.removeChild(timerSecText);    
}

//------------------------------------------------------------------------------------------------------------------
//  ステージ生成
//------------------------------------------------------------------------------------------------------------------

//	ステージサイズ
var STAGE_SIZE_TABLE = [5, 7, 10];	//	レベルによるステージの広さ
var STAGE_WIDTH = 15;
var STAGE_HEIGHT = 15;

var ROOT_MAX_TABLE = [10, 30, 60];	//	安全ルートの長さ

//	安全な道を生成するための情報(何歩まっすぐ進むか？)
var STEP_MIN_TABLE = [1, 1, 1];
var STEP_MAX_TABLE = [5, 6, 7];


//	ステージを生成する
function generateStage(level){
	//	まずはステージ配列を確保
	stageData = new Array(STAGE_WIDTH);			
	for (var stageIndex = 0; stageIndex < stageData.length; stageIndex++){
		stageData[stageIndex] = new Array(STAGE_HEIGHT);
	}
	//	ステージデータの初期化
	for (var x = 0; x < stageData.length; x++){
		for (var y = 0; y < stageData[x].length; y++){
			stageData[x][y] = 0;
		}
	}	

	//	ブロックのアニメーションパターン配列の確保
	stageFrame = new Array(STAGE_WIDTH);			
	for (var stageIndex = 0; stageIndex < stageFrame.length; stageIndex++){
		stageFrame[stageIndex] = new Array(STAGE_HEIGHT);
	}
	//	ブロックのアニメーションパターン配列の初期化
	for (var x = 0; x < stageFrame.length; x++){
		for (var y = 0; y < stageFrame[x].length; y++){
			stageFrame[x][y] = rand(0, 2);
		}
	}	

	//	スタート地点を決める。
	var startX = rand(1, STAGE_WIDTH - 2);
	var startY = rand(1, STAGE_HEIGHT - 2);
    playerX = startX;
    playerY = startY;

    //  やさしい以外はセンタリングする
    if (gameLevel != 0)
    {   
        scrollX = (chipWidth/2)*playerX -  playerY * (chipWidth/2);
        scrollY = (-chipHeight/2)*playerY;
        clampScrollXY();
    }
        
	//	一定の面積埋めるまでループ(無限ループ防止を入れるのもありだがおそらく大丈夫)			
	var rootCount = 0;	//	安全な場所の数
	var rootMax = ROOT_MAX_TABLE[level];	//	道の長さ
	var rootX = playerX;	//	現在の道X座標
	var rootY = playerY;	//	現在の道Y座標
	var rootDirc = 0;	//	道を塗る方向(0...UP,1...DOWN,2...RIGHT,3...LEFT)
	var rootStep = 0;	//	何歩進めるか
	var goalX = 0;
	var goalY = 0;
	
	while (rootCount < rootMax){
		//	どの方向に道を進めるか？
		rootDirc = rand(0, 3);
		rootStep = rand(STEP_MIN_TABLE[level], STEP_MIN_TABLE[level]);
		
		while(rootStep > 0){
			//	まずは道を埋める。ただしすでに道ならばカウントしない
			if (stageData[rootX][rootY] != 1){
				stageData[rootX][rootY] = 1;
				rootCount++;

				//	最後に埋めた場所をゴールとして一時保存
				goalX = rootX;
				goalY = rootY;
			}
			
			//	進むべき方向に移動
			switch(rootDirc)
			{
				case 0:
					rootY--;
				break;
				case 1:
					rootY++;
				break;
				case 2:
					rootX++;
				break;
				case 3:
					rootX--;
				break;
			}
			rootStep--;
			
			//	もし配列からはみ出てしまうのならばこれ以上移動せずに終了
			//	これはよくないので終了しないで違うルートを通るように修正
			if (rootX < 0 || rootY < 0 || rootX >= STAGE_WIDTH || rootY >= STAGE_HEIGHT){
				//	安全だった場所まで戻す
				rootX = goalX;
				rootY = goalY;
				break;
			}
		}
	}

	//	お化けを配置する
	var ghostCount = 0;
	GHOST_MAX = GHOST_MAX_TABLE[ level ];
    ghostSpriteTable = new Array(GHOST_MAX);

	while (ghostCount < GHOST_MAX){
		var randomX = rand(0, STAGE_WIDTH - 1);
		var randomY = rand(0, STAGE_HEIGHT - 1);
		if (stageData[randomX][randomY] == 0) {
            //  簡単は隣接した場所にプレイヤーがいないようにする
            if (gameLevel == 0)
            {
                if ((Math.abs(playerX - randomX) == 1 && Math.abs(playerY - randomY) == 0) ||
                    (Math.abs(playerX - randomX) == 0 && Math.abs(playerY - randomY) == 1)) {
                    }
                    else{
                        stageData[randomX][randomY] = 2;
                        ghostCount++;                
                    }                      
            } else {
                stageData[randomX][randomY] = 2;
                ghostCount++;                
            }
		}
	}			
	
	//	アイテムを配置する
    var itemCount = 0;
    ITEM_MAX = ITEM_MAX_TABLE[gameLevel];
    candySpriteTable = new Array(ITEM_MAX);
    glassSpriteTable = new Array(ITEM_MAX);
    starSpriteTable = new Array(ITEM_MAX);

	while (itemCount < ITEM_MAX){
		var randomX = rand(0, STAGE_WIDTH - 1);
		var randomY = rand(0, STAGE_HEIGHT - 1);
		if (stageData[randomX][randomY] == 0) {
            switch(rand(0, 2)) {
            case 0:
    			stageData[randomX][randomY] = 7; //  キャンディー
            break;
            case 1:
    			stageData[randomX][randomY] = 8; //  メガネ
            break;
            case 2:                
    			stageData[randomX][randomY] = 9; //  スター
            break;
            }
			itemCount++;
		}
	}			
	
	//	スタート地点を決める			
	stageData[playerX][playerY] = 3;
	//	ゴール地点を決める
    if (gameLevel == 0)
    {
        //  「かんたん」なら初めから見えてる
    	stageData[goalX][goalY] = 13;        
    } else {
    	stageData[goalX][goalY] = 4;        
    }
 

    //  ステージステートを保存する配列を持つ  
	stageShake = new Array(STAGE_WIDTH);			
	for (var stageIndex = 0; stageIndex < stageShake.length; stageIndex++){
		stageShake[stageIndex] = new Array(STAGE_HEIGHT);
	}
	
	//	ステージステートの初期化
	for (var x = 0; x < stageShake.length; x++){
		for (var y = 0; y < stageShake[x].length; y++){
			stageShake[x][y] = 0;
		}
	}
    			
}

//------------------------------------------------------------------------------------------------------------------
//  最短路検索
//------------------------------------------------------------------------------------------------------------------

var pathData;   //  最短路を保存する場所

//  パスデータを生成
function initPathData()
{
	//	まずは最短路配列を確保
	pathData = new Array(STAGE_WIDTH);			
	for (var stageIndex = 0; stageIndex < pathData.length; stageIndex++){
		pathData[stageIndex] = new Array(STAGE_HEIGHT);
	}
	//	最短路データの初期化
	for (var x = 0; x < pathData.length; x++){
		for (var y = 0; y < pathData[x].length; y++){
			pathData[x][y] = 0;
		}
	}	
    
}

var CANT_ENTER = -3;    //  入れない場所
var CAN_ENTER = -2;
var START_ID = -1;   //  スタート地点

//  最短路を見つける
function findPath(startX, startY, goalX, goalY)
{
    playerGoalX = goalX;
    playerGoalY = goalY;
    
	//	最短路データの初期化
	for (var x = 0; x < pathData.length; x++){
		for (var y = 0; y < pathData[x].length; y++){
			pathData[x][y] = CANT_ENTER;
		}
	}	

    //  ここで歩ける場所にマークをつける！
	for (var x = 0; x < pathData.length; x++){
		for (var y = 0; y < pathData[x].length; y++){
            switch(stageData[x][y])
            {
                case 3:
                case 5:
                case 10:
                case 11:
                case 12:
         			pathData[x][y] = CAN_ENTER;
                break;            
            }
		}
	}	

    var pathID = 0;
    pathData[goalX][goalY] = pathID;
    pathData[startX][startY] = START_ID;

    var isGoal = -1;    //  紛らわしいけどスタートにたどり着いたかどうかのフラグ
    while(isGoal == -1)
    {
        pathID++;
        isGoal = fillPath(pathID);     
    }
    
}

//  実際に塗る処理
function fillPathMain(x, y, pathID)
{
    //  範囲チェック
    if (x < 0 || x >= STAGE_WIDTH || y < 0 || y >= STAGE_WIDTH)
    {
        return -1;
    }

    //  ゴールについた？
    if (pathData[x][y] == START_ID)
    {
        pathData[x][y] = pathID;
        return 1;
    }    
    
    //  歩けない場所？
    if (pathData[x][y] == CANT_ENTER)
    {
        return -1;
    }
    
    //  すでに塗ってたりしない？
    if (pathData[x][y] != CAN_ENTER)
    {
        return -1;
    }
    
    //  塗る
    pathData[x][y] = pathID;
    return -1;
}

//  最短路を塗りつぶす
function fillPath(pathID)
{
	for (var x = 0; x < pathData.length; x++)
    {
		for (var y = 0; y < pathData[x].length; y++)
        {
            //  前回塗った場所を発見？
			if (pathData[x][y] == pathID - 1)
            {
                //  上下左右の塗れる場所をpathIDで塗る
                if (fillPathMain(x - 1, y, pathID) == 1)
                {
                    return 1;
                }
                if (fillPathMain(x + 1, y, pathID) == 1)
                {
                    return 1;
                }
                if (fillPathMain(x, y - 1, pathID) == 1)
                {
                    return 1;
                }
                if (fillPathMain(x, y + 1, pathID) == 1)
                {
                    return 1
                }
            }
		}
    }
    return -1;   
}

//------------------------------------------------------------------------------------------------------------------
//  お化けがいる箱の処理
//------------------------------------------------------------------------------------------------------------------
var stageShake;     //  箱の揺れ具合

//  引っ越しお化け
var ghostMove;      //  移動用のお化けスプライト
var isGhostMove;    //  お化け移動中？
var ghostDircX;     //  移動ベクトル
var ghostDircY;     //  移動ベクトル
var ghostSpeed;     //  移動速度
var ghostMoveLife;  //  移動時間
var ghostMoveCount; //  移動方向変更回数

//  お化けがいる箱を揺らす
function SetShakeBox()
{
    var shakeProb = [4, 2, 1]
    //  お化けがいる場所を探す    
	for (var x = 0; x < stageData.length; x++)
    {
		for (var y = 0; y < stageData[x].length; y++)
        {
            if (stageData[x][y] == 2)
            {
                if (rand(0, 400) < shakeProb[gameLevel])
                {
                    //  今は揺れてない？
                    if (stageShake[x][y] == 0)
                    {
                        if (gameLevel == 0)
                        {
                            stageShake[x][y] = rand(4, 10);
                        }
                        if (gameLevel == 1)
                        {
                            stageShake[x][y] = rand(4, 7);
                        }
                        if (gameLevel == 2)
                        {
                            stageShake[x][y] = rand(2, 4);
                        }
                    }
                }
            }
		}
	}
    
}

//  お化けが引っ越すかを決める
function SetGhostMove() {
    //  すでに出ているならやらない。一度に一匹のみ
//    if (isGhostMove == 1) {
        return;
//    }

    //  お化けがいる場所を探す    
	for (var x = 0; x < stageData.length; x++){
		for (var y = 0; y < stageData[x].length; y++){
            if (stageData[x][y] == 2) {
                if (rand(0, 100) < 5) {
                    isGhostMove = 1;
                    ghostDircX = rand(-100, 100) / 100;
                    ghostDircY = rand(-100, 100) / 100;
                    ghostSpeed = rand(1, 4);
                    ghostMoveLife = rand(15, 30);
                    ghostMove.opacity = 1;
                    ghostMove.x = stageSprite[x][y].x;
                    ghostMove.y = stageSprite[x][y].y - 40;
                    return;                  
                }
            }
		}
	}

}

//  お化けの引っ越し
function DoGhostMove() {
    if (isGhostMove == 0) {
        return;
    }
    //  お化け適当に移動
    ghostMove.x += ghostDircX * ghostSpeed;
    ghostMove.y += ghostDircY * ghostSpeed;

    //  方向転換？
    ghostMoveLife--;    
    if (ghostMoveLife < 0) {
        ghostDircX = rand(-100, 100) / 100;
        ghostDircY = rand(-100, 100) / 100;
        ghostSpeed = rand(1, 4);
        ghostMoveLife = rand(15, 30);
    }

    //  少しずつ透明にする
    ghostMove.opacity -= 0.01;
    if (ghostMove.opacity < 0) {
        ghostMove.opacity = 0;
        isGhostMove = 0;          
    }

}

//------------------------------------------------------------------------------------------------------------------
//  マップスクロールカーソル関連
//------------------------------------------------------------------------------------------------------------------
var ARROW_NUM = 4;
var arrowSpriteTable;
var arrowPositionXTable = [0, 320 - 32,  640 - 64, 320 -32];
var arrowPositionYTable = [(580/2) - 32, 0,  (580/2) - 32, 580 - 32];
var arrowPositionRotateTable = [0, 90, 180, 270];
var arrowPositionOpacityTable = [1, 1, 1, 1];
var isArrowTouched = -1;
var SCROLL_STEP = 16;

var arrowMove = 0;
var ARROW_MOVE_SPEED = 0.75;
var ARROW_MOVE_MAX = 8;

var ARROW_X_DIRC = [-1, 0, 1, 0];
var ARROW_Y_DIRC = [0, -1, 0, 1];

var arrowMoveCount = 0;
var ARROW_MOVE_COUNT_MAX = 2;

function initArrowSprite(scene)
{
    //  スクロールする必要がないので出さない
    if (gameLevel == 0)
    {
        return;
    }
    
    arrowSpriteTable = new Array(ARROW_NUM);
    for(var arrowIndex = 0; arrowIndex < ARROW_NUM; arrowIndex++)
    {
        arrowSpriteTable[arrowIndex] = new Sprite(64, 64);
        arrowSpriteTable[arrowIndex].image = game.assets[ UI_ARROW ];
        arrowSpriteTable[arrowIndex].x = arrowPositionXTable[arrowIndex] + ARROW_X_DIRC[arrowIndex] * (arrowMove * ARROW_MOVE_SPEED);
        arrowSpriteTable[arrowIndex].y = arrowPositionYTable[arrowIndex] + ARROW_Y_DIRC[arrowIndex] * (arrowMove * ARROW_MOVE_SPEED);
        arrowSpriteTable[arrowIndex].rotation = arrowPositionRotateTable[arrowIndex];
        arrowSpriteTable[arrowIndex].opacity = arrowPositionOpacityTable[arrowIndex];
        
        

        arrowSpriteTable[arrowIndex].addEventListener(Event.TOUCH_END, function(e)
        {
            isArrowTouched = -1;
        });

        arrowSpriteTable[arrowIndex].addEventListener(Event.TOUCH_START, function(e)
        {
            switch(this.rotation)
            {
            case 0:     //X+
                isArrowTouched = 1;
            break;
            case 90:    //Y+
                isArrowTouched = 2;
            break;
            case 180:   //X-
                isArrowTouched = 3;
            break;
            case 270:   //Y-
                isArrowTouched = 4;
            break;    
            }
            
        });

        scene.addChild(arrowSpriteTable[arrowIndex]);
    }
    
}


function runArrowSprite()
{
    //  スクロールする必要がないので出さない
    if (gameLevel == 0)
    {
        return;
    }

    arrowMoveCount++;
    if (arrowMoveCount >= ARROW_MOVE_COUNT_MAX)
    {
        arrowMoveCount = 0;
        arrowMove++;
        if (arrowMove >= ARROW_MOVE_MAX)
        {
            arrowMove = 0;
        }        
    }

    //  最大幅までスクロールしてたら消す
    for(var arrowIndex = 0; arrowIndex < ARROW_NUM; arrowIndex++)
    {
        arrowPositionOpacityTable[arrowIndex] = 1;
        switch(arrowSpriteTable[arrowIndex].rotation)
        {
        case 0:     //X+
            if (scrollX >= SCROLL_X_MAX[gameLevel])
            {
                arrowPositionOpacityTable[arrowIndex] = 0;                
            }
        break;
        case 90:    //Y+
            if (scrollY >= SCROLL_Y_MAX[gameLevel])
            {
                arrowPositionOpacityTable[arrowIndex] = 0;                
            }
        break;
        case 180:   //X-
            if (scrollX <= SCROLL_X_MIN[gameLevel])
            {
                arrowPositionOpacityTable[arrowIndex] = 0;                
            }
        break;
        case 270:   //Y-
            if (scrollY <= SCROLL_Y_MIN[gameLevel])
            {
                arrowPositionOpacityTable[arrowIndex] = 0;                
            }
        break;    
        }

        arrowSpriteTable[arrowIndex].opacity = arrowPositionOpacityTable[arrowIndex];
        arrowSpriteTable[arrowIndex].x = arrowPositionXTable[arrowIndex] + ARROW_X_DIRC[arrowIndex] * (arrowMove * ARROW_MOVE_SPEED);
        arrowSpriteTable[arrowIndex].y = arrowPositionYTable[arrowIndex] + ARROW_Y_DIRC[arrowIndex] * (arrowMove * ARROW_MOVE_SPEED);
    }

    if (isArrowTouched == -1)
    {
        return;
    }
    //  何か特殊な事をやっている時はスクロールしない
    if (isStartAnimPlaying == 1 || playerGoal == 1 || lifeCount == 0)
    {
        return;
    }

    switch(isArrowTouched)
    {
    case 1:
        scrollX += SCROLL_STEP;
    break;
    case 2:
        scrollY += SCROLL_STEP;
    break;
    case 3:
        scrollX -= SCROLL_STEP;
    break;
    case 4:
        scrollY -= SCROLL_STEP;
    break;    
    }    

    //  スクロール範囲のチェック
    clampScrollXY();

    removeStageSprite();
    initStage(game.currentScene);
}

function removeArrowSprite()
{
    //  スクロールする必要がないので出さない
    if (gameLevel == 0)
    {
        return;
    }
    
    for(var arrowIndex = 0; arrowIndex < ARROW_NUM; arrowIndex++)
    {
        arrowSpriteTable[arrowIndex].parentNode.removeChild(arrowSpriteTable[arrowIndex]);
    }    
}

//  スクロール最大値情報
var SCROLL_X_MAX = [0, 256, 512];
var SCROLL_Y_MAX = [0, 16, 32];
var SCROLL_X_MIN = [0, -256, -512];
var SCROLL_Y_MIN = [0, -272, -512];

function clampScrollXY()
{
    if (gameLevel == 0)
    {
        return;
    }
    
    //  移動幅のチェック
    if (scrollX < SCROLL_X_MIN[gameLevel])
    {
        scrollX = SCROLL_X_MIN[gameLevel];
    }
    if (scrollX > SCROLL_X_MAX[gameLevel])
    {
        scrollX = SCROLL_X_MAX[gameLevel];
    }
    if (scrollY < SCROLL_Y_MIN[gameLevel])
    {
        scrollY = SCROLL_Y_MIN[gameLevel];
    }
    if (scrollY > SCROLL_Y_MAX[gameLevel])
    {
        scrollY = SCROLL_Y_MAX[gameLevel];
    }
    
}

//------------------------------------------------------------------------------------------------------------------
//  スーテジ関連
//------------------------------------------------------------------------------------------------------------------
var chipWidth = 128;	//	マップチップ１個の横幅
var chipHeight = 80;	//	マップチップ１個の縦幅
var scrollX = 0;	//	スクロール用座標
var scrollY = 0;	//	スクロール用座標

//	ステージの初期化
function initStage(scene) {
    
    //	配列を確保
    stageSprite = new Array(STAGE_WIDTH);			
    for (var stageIndex = 0; stageIndex < stageSprite.length; stageIndex++){
        stageSprite[stageIndex] = new Array(STAGE_HEIGHT);	//0～9
    }
    ghostIndexData = new Array(STAGE_WIDTH);			
    for (var stageIndex = 0; stageIndex < stageSprite.length; stageIndex++){
        ghostIndexData[stageIndex] = new Array(STAGE_HEIGHT);	//0～9
    }

    //	ステージ分のスプライトを確保していく
    var mapchipBaseX = game.width/2 - 64;
    var mapchipBaseY = 240 - AD_OFFSET;
    
    var ghostIndex = 0;
    var candyIndex = 0;
    var glassIndex = 0;
    var starIndex = 0;

    candyCount = 0;
    glassCount = 0;
    starCount = 0;
    
   //	スプライトの画像とポジションを設定していく(まずは床)
    for (var x = 0; x < stageSprite.length; x++){
        var mapchipX = mapchipBaseX;
        var mapchipY = mapchipBaseY;
        for (var y = 0; y < stageSprite[x].length; y++){
            //  マップチップの種類にあったスプライトを登録する
            switch(stageData[x][y]){
            case 3:	//	スタート
            case 5:	//	床(何もない)
            case 6:	//	床(上にお化けがいる)
            case 10://	床（キャンディー）
            case 11://	床（メガネ）
            case 12://	床（スター）
                stageSprite[x][y] = new Sprite(game.assets[ MAPCHIP03 ].width,game.assets[ MAPCHIP03 ].height);
                stageSprite[x][y].image = game.assets[ MAPCHIP03 ];
                stageSprite[x][y].x = mapchipX + scrollX;
                stageSprite[x][y].y = mapchipY + scrollY;
                stageSprite[x][y].y += 50; 
                scene.addChild( stageSprite[x][y] );
            break;
            }


            mapchipX += chipWidth/2;
            mapchipY += chipHeight/2;					
        }
        mapchipBaseX -= chipWidth/2;
        mapchipBaseY += chipHeight/2;
    }				
     
    
    //	スプライトの画像とポジションを設定していく
    for (var x = 0; x < stageSprite.length; x++){
        var mapchipX = mapchipBaseX;
        var mapchipY = mapchipBaseY;
        for (var y = 0; y < stageSprite[x].length; y++){

            //  マップチップの種類にあったスプライトを登録する
            switch(stageData[x][y]){
            case 0:	//	通常ブロック
            case 1: //  正解ルート
            case 2: //  ゴーストが隠れている木箱
            case 4: //  ゴールが隠れている木箱
            case 7:	//	キャンディー
            case 8:	//	メガネ
            case 9:	//	スター
                stageSprite[x][y] = new Sprite(128, 128);
                stageSprite[x][y].image = game.assets[ BLOCK ];
                stageSprite[x][y].frame = stageFrame[x][y];
                stageSprite[x][y].x = mapchipX + scrollX;
                if (stageData[x][y] == 7 || stageData[x][y] == 8 || stageData[x][y] == 9)
                {
                    stageSprite[x][y].y = mapchipY + scrollY + 40;                    
                }
                else {
                    stageSprite[x][y].y = mapchipY + scrollY;                    
                }
                scene.addChild( stageSprite[x][y] );
            break;
            case 13:	//	ゴール
                stageSprite[x][y] = new Sprite(game.assets[ MAPCHIP05 ].width,game.assets[ MAPCHIP05 ].height);
                stageSprite[x][y].image = game.assets[ MAPCHIP05 ];
                stageSprite[x][y].x = mapchipX + scrollX;
                stageSprite[x][y].y = mapchipY + scrollY;
                scene.addChild( stageSprite[x][y] );
            break;
            }

            //  アイテムの位置を設定（床のパターンに切り替わっているため50下がっている）
            setItemEffectPos(x,y, stageSprite[x][y].x + 20, stageSprite[x][y].y - 50);
            //  破壊ブロックの位置を設定
            setBreakBlockPos(x,y, stageSprite[x][y].x - BREAK_BLOCK_WIDTH/2 + BREAK_BLOCK_OFFSET_X, stageSprite[x][y].y - BREAK_BLOCK_HEIGHT/2 - 50);

            ghostIndexData[x][y] = -1;
            //  ゴーストがいる
            if (stageData[x][y] == 2 || stageData[x][y] == 6) {
                ghostIndexData[x][y] = ghostIndex;
                ghostSpriteTable[ghostIndex] = new Sprite(GHOST_WIDTH, GHOST_HEIGHT);
                ghostSpriteTable[ghostIndex].image = game.assets[ GHOST ];
                ghostSpriteTable[ghostIndex].x = mapchipX + scrollX;
                ghostSpriteTable[ghostIndex].y = mapchipY + scrollY - 32;
                ghostSpriteTable[ghostIndex].opacity = 0;
                if (stageData[x][y] == 6){
                    ghostSpriteTable[ghostIndex].opacity = 1;                            
                }
                //  アニメーションは続きから
                ghostSpriteTable[ghostIndex].frame = GHOST_ANIM_NUM[GHOST_STATE_ATTACK] * ghostAnimStateTable[ghostIndex] + ghostAnimNowIndexTable[ghostIndex];

                scene.addChild( ghostSpriteTable[ghostIndex] );
                ghostIndex++;
            }

            //  キャンディがある
            if (stageData[x][y] == 7 || stageData[x][y] == 10) {
                candySpriteTable[candyIndex] = new Sprite(ITEM_WIDTH, ITEM_HEIGHT);
                candySpriteTable[candyIndex].image = game.assets[ ITEM ];
                candySpriteTable[candyIndex].x = mapchipX + scrollX;
                candySpriteTable[candyIndex].y = mapchipY + scrollY + 8;
                candySpriteTable[candyIndex].opacity = 0;
                candySpriteTable[candyIndex].frame = 0;
                if (stageData[x][y] == 10){
                    candySpriteTable[candyIndex].opacity = 1;                            
                }
                scene.addChild( candySpriteTable[candyIndex] );
                candyIndex++;
                candyCount++;
            }

            //  メガネがある
            if (stageData[x][y] == 8 || stageData[x][y] == 11) {
                glassSpriteTable[glassIndex] = new Sprite(ITEM_WIDTH, ITEM_HEIGHT);
                glassSpriteTable[glassIndex].image = game.assets[ ITEM ];
                glassSpriteTable[glassIndex].x = mapchipX + scrollX;
                glassSpriteTable[glassIndex].y = mapchipY + scrollY + 8;
                glassSpriteTable[glassIndex].opacity = 0;
                glassSpriteTable[glassIndex].frame = 2;
                if (stageData[x][y] == 11){
                    glassSpriteTable[glassIndex].opacity = 1;                            
                }
                scene.addChild( glassSpriteTable[glassIndex] );
                glassIndex++;
                glassCount++;
            }

            //  スターがある
            if (stageData[x][y] == 9 || stageData[x][y] == 12) {
                starSpriteTable[starIndex] = new Sprite(ITEM_WIDTH, ITEM_HEIGHT);
                starSpriteTable[starIndex].image = game.assets[ ITEM ];
                starSpriteTable[starIndex].x = mapchipX + scrollX;
                starSpriteTable[starIndex].y = mapchipY + scrollY + 8;
                starSpriteTable[starIndex].opacity = 0;
                starSpriteTable[starIndex].frame = 1;
                if (stageData[x][y] == 12){
                    starSpriteTable[starIndex].opacity = 1;                            
                }
                scene.addChild( starSpriteTable[starIndex] );
                starIndex++;
                starCount++;
            }


            //  プレイヤー
            if (x == playerX && y == playerY) {
                playerSprite = new Sprite(PLAYER_WIDTH, PLAYER_HEIGHT);
                playerSprite.image = game.assets[ PLAYER_ANIM ];
                playerSprite.x = mapchipX + scrollX + moveGoalX * moveGoalCount;
                playerSprite.y = mapchipY + scrollY + moveGoalY * moveGoalCount;    
                playerSprite.frame = PLAYER_ANIM_NUM[0] * playerAnimState + playerAnimNowIndex;               
                scene.addChild( playerSprite );
            }
            
            mapchipX += chipWidth/2;
            mapchipY += chipHeight/2;					
        }
        mapchipBaseX -= chipWidth/2;
        mapchipBaseY += chipHeight/2;
    }				

    ghostMove　= new Sprite(GHOST_WIDTH, GHOST_HEIGHT);
    ghostMove.image = game.assets[ GHOST ];
    ghostMove.x = game.width/2 - ghostMove.width/2;
    ghostMove.y = 480;
    ghostMove.opacity = 0;  //  まずは透明にしておく
    scene.addChild( ghostMove );
    
    //  木箱の破壊を復活
    resumeBreakBlock(scene);
    //  キラキラエフェクトを復活
    resumeItemEffect(scene);
    //  スコアゲット表示を復活
    resumeScoreInfo(scene);
    //  ライフ表示を復活
    resumeLife(scene);
    //  アイテム効果ウィンドウを復帰
    entryItemBuffWindow();

    //  画面下のウィンドウを初期化
    initWindow(scene);

    //  ライフ
    initLife(scene);
    
    //  矢印
    initArrowSprite(scene);
}

//  広告のためにどれくらいずらすか？
var AD_OFFSET = 100;

//	スクロール処理
function scrollMap(){
    var mapchipBaseX = game.width/2 - 64;
    var mapchipBaseY = 240 - AD_OFFSET;
    
    var ghostIndex = 0;
    var candyIndex = 0;
    var glassIndex = 0;
    var starIndex = 0;
    
    for (var x = 0; x < stageSprite.length; x++){
        var mapchipX = mapchipBaseX;
        var mapchipY = mapchipBaseY;
        for (var y = 0; y < stageSprite[x].length; y++){
            var shakeY = 0;
            if (stageShake[x][y] != 0) {
                stageShake[x][y]--;
                shakeY = rand(-3, 3);                   
            }

            stageSprite[x][y].x = mapchipX + scrollX;
            stageSprite[x][y].y = mapchipY + scrollY + shakeY;
            //  床なら下げる
            if (stageData[x][y] == 3 || stageData[x][y] == 5 || stageData[x][y] == 6 || stageData[x][y] == 10 || stageData[x][y] == 11 || stageData[x][y] == 12) {
                stageSprite[x][y].y += 50; 
            }
            
            if (x == playerX && y == playerY){
                playerSprite.x = mapchipX + scrollX + moveGoalX * moveGoalCount;
                playerSprite.y = mapchipY + scrollY + moveGoalY * moveGoalCount;                        
            }

            //  ゴーストがいる
            if (stageData[x][y] == 2 || stageData[x][y] == 6) {
                //  インデックス情報を保存
                ghostIndexData[x][y] = ghostIndex;
                
                ghostSpriteTable[ghostIndex].x = mapchipX + scrollX;
                ghostSpriteTable[ghostIndex].y = mapchipY + scrollY - 32;
                ghostIndex++;
            }

            //  キャンディがある
            if (stageData[x][y] == 7 || stageData[x][y] == 10) {
                candySpriteTable[candyIndex].x = mapchipX + scrollX;
                candySpriteTable[candyIndex].y = mapchipY + scrollY + 8;
                candyIndex++;
            }

            //  メガネがある
            if (stageData[x][y] == 8 || stageData[x][y] == 11) {
                glassSpriteTable[glassIndex].x = mapchipX + scrollX;
                glassSpriteTable[glassIndex].y = mapchipY + scrollY + 8;
                glassIndex++;
            }

            //  スターがある
            if (stageData[x][y] == 9 || stageData[x][y] == 12) {
                starSpriteTable[starIndex].x = mapchipX + scrollX;
                starSpriteTable[starIndex].y = mapchipY + scrollY + 8;
                starIndex++;
            }

            
            mapchipX += chipWidth/2;
            mapchipY += chipHeight/2;					
        }
        mapchipBaseX -= chipWidth/2;
        mapchipBaseY += chipHeight/2;
    }
        
    //  BGもスクロールについてくる
    setCliffPos();
    bgLeft.x += scrollX;	
    bgLeft.y += scrollY;	

    bgRight.x += scrollX;	
    bgRight.y += scrollY;	
}

//  床かどうか？
function isFloor(x,y)
{
    if (x < 0 || y < 0 || x >= STAGE_WIDTH || y >= STAGE_WIDTH)
    {
        return -1;
    }
    
    switch(stageData[x][y]) {
        case 3:
        case 5:
        case 10:
        case 11:
        case 12:
        case 13:    //  ゴールはどうするか・・・
            return 1;    
        break;
    }
    return -1;    
}

function isFloorWithOutGoal(x,y)
{
    if (x < 0 || y < 0 || x >= STAGE_WIDTH || y >= STAGE_WIDTH)
    {
        return -1;
    }
    
    switch(stageData[x][y]) {
        case 3:
        case 5:
        case 10:
        case 11:
        case 12:
            return 1;    
        break;
    }
    return -1;    
}

function isGoal(x,y)
{
    if (x < 0 || y < 0 || x >= STAGE_WIDTH || y >= STAGE_WIDTH)
    {
        return -1;
    }
    
    switch(stageData[x][y]) {
        case 13:
            return 1;    
        break;
    }
    return -1;    
}

var BREAK_BLOCK_OFFSET_X = 64;

function getPlayerDirc(x,y)
{
    if (playerX > x)
    {
        return 3;
    }    
    if (playerX < x)
    {
        return 0;
    }    
    if (playerY > y)
    {
        return 1;
    }    
    return 2;
}

//  こわせる木箱なら壊す
function breakBlock(x,y)
{
    var remake = -1;

    //  範囲チェック
    if (x < 0 || x >= STAGE_WIDTH || y < 0 || y >= STAGE_WIDTH)
    {
        return -1;
    }

    switch(stageData[x][y]){
    case 0:
    case 1:
        //  何もない木箱は床に変更
        changePlayerAnim(7 + getPlayerDirc(x,y));
        stageData[x][y] = 5;
        entryBreakBlock(game.currentScene, stageSprite[x][y].x - BREAK_BLOCK_WIDTH/2 + BREAK_BLOCK_OFFSET_X, stageSprite[x][y].y - BREAK_BLOCK_HEIGHT/2, x, y);
        entryScoreInfo(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, 0);
        remake = 1;
        break;
    case 2:
        //  お化けの場所
        stageData[x][y] = 6;
        entryBreakBlock(game.currentScene, stageSprite[x][y].x - BREAK_BLOCK_WIDTH/2 + BREAK_BLOCK_OFFSET_X, stageSprite[x][y].y - BREAK_BLOCK_HEIGHT/2, x, y);
        //  無敵状態ならダメージを受けない
        if (isItemBuffOn == 1 && itemBuffType == 2)
        {
            //  無敵
        } else {
            //  ここでプレイヤーのダメージ処理
            var sound = game.assets[SE_DAMAGE].clone();
            sound.play();
            damageLife();
            changePlayerAnim(0);
        }
        //  お化け登場演出
        changeGhostAnim(ghostIndexData[x][y], GHOST_STATE_ATTACK);
        remake = 1;
        break;                            
    case 4:
        changePlayerAnim(7 + getPlayerDirc(x,y));
        //  ゴールの場所
        stageData[x][y] = 13;
        entryBreakBlock(game.currentScene, stageSprite[x][y].x - BREAK_BLOCK_WIDTH/2 + BREAK_BLOCK_OFFSET_X, stageSprite[x][y].y - BREAK_BLOCK_HEIGHT/2, x, y);
        entryScoreInfo(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, 0);
        remake = 1;
        break;                            
    case 7:
        //  アイテムの場所
        changePlayerAnim(7 + getPlayerDirc(x,y));
        stageData[x][y] = 10;
        entryBreakBlock(game.currentScene, stageSprite[x][y].x - BREAK_BLOCK_WIDTH/2 + BREAK_BLOCK_OFFSET_X, stageSprite[x][y].y - BREAK_BLOCK_HEIGHT/2, x, y);
        entryScoreInfo(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, 0);
        entryItemEffect(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, x, y);
        remake = 1;
        break;                            
    case 8:
        //  アイテムの場所
        changePlayerAnim(7 + getPlayerDirc(x,y));
        stageData[x][y] = 11;
        entryBreakBlock(game.currentScene, stageSprite[x][y].x - BREAK_BLOCK_WIDTH/2 + BREAK_BLOCK_OFFSET_X, stageSprite[x][y].y - BREAK_BLOCK_HEIGHT/2, x, y);
        entryScoreInfo(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, 0);
        entryItemEffect(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, x, y);
        remake = 1;
        break;                            
    case 9:
        //  アイテムの場所
        changePlayerAnim(7 + getPlayerDirc(x,y));
        stageData[x][y] = 12;
        entryBreakBlock(game.currentScene, stageSprite[x][y].x - BREAK_BLOCK_WIDTH/2 + BREAK_BLOCK_OFFSET_X, stageSprite[x][y].y - BREAK_BLOCK_HEIGHT/2, x, y);
        entryScoreInfo(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, 0);
        entryItemEffect(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, x, y);
        remake = 1;
        break;
    }                            
    return remake;
}

//  画面を再描画すべきかのフラグ
var dirty = -1;

//  スクロール可能か？
function canScroll()
{
    if (gameLevel == 0)
    {
        return -1;
    }
}

//  マウスがクリックされた場所を求める
function onMouse() {
    
    //  もしスタート！表示中なら何もしない
    //  プレイヤーがゴールしていたらもう受け付けない
    //  ゲームオーバーなら受け付けない
    //  移動中なら受け付けない
    //  マップスクロール中なら受け付けない
    if (isStartAnimPlaying == 1 || playerGoal == 1 || lifeCount == 0 || isMoving != -1 || isArrowTouched != -1 || dirty == 1 || isScroll == 1)
    {
        return;
    }
    var px = mouseX;
    var py = mouseY;            
    
    var hitX = -1;
    var hitY = -1;
    
    var isHit = -1;
    
    nextBreakBlockX = -1;
    nextBreakBlockY = -1;
    
    //  まずは一度あたり判定をチェック
    for (var x = 0; x < stageSprite.length; x++)
    {
        for (var y = 0; y < stageSprite[x].length; y++)
        {
            var ax = stageSprite[x][y].x;
            var ay = stageSprite[x][y].y + 36;
            var bx = stageSprite[x][y].x + 64;
            var by = stageSprite[x][y].y;
            var cx = stageSprite[x][y].x + 128;
            var cy = stageSprite[x][y].y + 36;
            var dx = stageSprite[x][y].x + 64;
            var dy = stageSprite[x][y].y + 74;
            
            var resultA = pointInTriangle(px,py, cx,cy, bx,by, ax,ay);
            var resultB = pointInTriangle(px,py, cx,cy, ax,ay, dx,dy);

            if (resultA == 1 || resultB == 1)
            {
                isHit = 1;
                hitX = x;
                hitY = y;
            }

            //  床部分をタップしたか?(プレイヤーが視覚的に押しやすいので床もチェック)
            switch(stageData[x][y])
            {
            case 3:	//	スタート
            case 5:	//	床(何もない)
            case 6:	//	床(上にお化けがいる)
            case 10://	床（キャンディー）
            case 11://	床（メガネ）
            case 12://	床（スター）
            case 13://	ゴール
                ay = stageSprite[x][y].y + 36 + 50;
                by = stageSprite[x][y].y + 50;
                cy = stageSprite[x][y].y + 36 + 50;
                dy = stageSprite[x][y].y + 74 + 50;
                resultA = pointInTriangle(px,py, cx,cy, bx,by, ax,ay);
                resultB = pointInTriangle(px,py, cx,cy, ax,ay, dx,dy);
                if (resultA == 1 || resultB == 1)
                {
                    isHit = 1;
                    hitX = x;
                    hitY = y;
                }
            break;
            }            
            
        }
    }
    
    x = hitX;
    y = hitY;
    if (isHit == 1)
    {
        
        //  今いる床とは違う床がとにかくクリックされた
        if (playerX != x || playerY != y) {
            if (isFloor(x,y) == 1)
            {
                if (stageData[x][y] == 13)
                {
                    //  ゴールがクリックされたが四方は木箱
                    if (isFloor(x-1,y) != 1 && isFloor(x+1,y) != 1 && isFloor(x, y-1) != 1 && isFloor(x,y+1) != 1)
                    {
                        return;
                    }                    
                }
                
                //  歩く処理の準備
                findPath(playerX, playerY, x, y);
                //  歩き中
                isMoving = 1;
                return;
            }
        }
        //  隣に床があるブロックがクリックされたので隣まで移動
        if ((Math.abs(playerX - x) == 1 && Math.abs(playerY - y) == 0) ||
            (Math.abs(playerX - x) == 0 && Math.abs(playerY - y) == 1)) {
                //  すぐ隣なら通常の処理に逃す
        } else {
            switch(stageData[x][y]) {
            case 0:
            case 1:
            case 2:
            case 4:
            case 7:
            case 8:
            case 9:
            case 13:
                //  自分と目的地との位置関係から一番近い場所を優先する
                var distID = -1;
                var dist = 100000;
                if (isFloor(x - 1,y) == 1 && isGoal(x -1, y) == -1) //  うっかりとゴールに入るのを防ぐ
                {
                    if (playerX != x-1 || playerY != y)
                    {
                        //  ２点間の距離を求める
                        var xydist = calcDist(playerX, playerY, x-1, y);
                        if (xydist < dist)
                        {
                            dist = xydist;
                            distID = 0;
                        }
                    }
                }
                if (isFloor(x + 1,y) == 1  && isGoal(x + 1, y) == -1)
                {
                    if (playerX != x+1 || playerY != y)
                    {
                        //  ２点間の距離を求める
                        var xydist = calcDist(playerX, playerY, x + 1, y);
                        if (xydist < dist)
                        {
                            dist = xydist;
                            distID = 1;
                        }
                    }
                }
                if (isFloor(x, y - 1) == 1 && isGoal(x, y - 1) == -1)
                {
                    if (playerX != x || playerY != y-1)
                    {
                        //  ２点間の距離を求める
                        var xydist = calcDist(playerX, playerY, x, y - 1);
                        if (xydist < dist)
                        {
                            dist = xydist;
                            distID = 2;
                        }
                    }
                }
                if (isFloor(x, y + 1) == 1 && isGoal(x, y + 1) == -1)
                {
                    if (playerX != x || playerY != y+1)
                    {
                        //  ２点間の距離を求める
                        var xydist = calcDist(playerX, playerY, x, y + 1);
                        if (xydist < dist)
                        {
                            dist = xydist;
                            distID = 3;
                        }
                    }
                }
            
                //  離れたブロックがクリックされた
                switch(distID)
                {
                case 0:
                    //  壊すブロックの予約
                    nextBreakBlockX = x;
                    nextBreakBlockY = y;
                    //  歩く処理の準備
                    findPath(playerX, playerY, x - 1, y);
                    //  歩き中
                    isMoving = 1;
                    return;
                break;
                case 1:
                    //  壊すブロックの予約
                    nextBreakBlockX = x;
                    nextBreakBlockY = y;
                    //  歩く処理の準備
                    findPath(playerX, playerY, x + 1, y);
                    //  歩き中
                    isMoving = 1;
                    return;
                break;
                case 2:
                    //  壊すブロックの予約
                    nextBreakBlockX = x;
                    nextBreakBlockY = y;
                    //  歩く処理の準備
                    findPath(playerX, playerY, x, y - 1);
                    //  歩き中
                    isMoving = 1;
                    return;
                break;
                case 3:
                    //  壊すブロックの予約
                    nextBreakBlockX = x;
                    nextBreakBlockY = y;
                    //  歩く処理の準備
                    findPath(playerX, playerY, x, y + 1);
                    //  歩き中
                    isMoving = 1;
                    return;
                break;
                }
            break;
            }
        }                    
            
        if ((Math.abs(playerX - x) == 1 && Math.abs(playerY - y) == 0) ||
            (Math.abs(playerX - x) == 0 && Math.abs(playerY - y) == 1)) {
            //  プレイヤーの隣がクリックされた
            isHit = 1;
            switch(stageData[x][y]) {
            case 3:
            case 5:
                //  ゴールについた？
                if (stageData[x][y] == 4)
                {
                    var sound = game.assets[SE_GOAL].clone();
                    sound.play();
                    playerGoal = 1;
                    changePlayerAnim(2);
                }
                var sound = game.assets[SE_WALK].clone();
                sound.play();
                
                //  歩く処理の準備
                findPath(playerX, playerY, x, y);

                //  歩き中
                isMoving = 1;
//                            playerX = x;
//                            playerY = y;
                dirty = 1;
                break;
            case 10:    //  キャンディー
            case 11:    //  メガネ
            case 12:    //  スター                 
                //  アイテムの上に乗った！アイテム効果発動！
                if (isItemBuffOn == 0)
                {
                    var sound = game.assets[SE_GET].clone();
                    sound.play();
                    removeItemEffectFromXY(x, y);
                    startItemBuff(stageData[x][y]);

                    entryScoreInfo(game.currentScene, stageSprite[x][y].x + 20, stageSprite[x][y].y, 1);
                    //  普通の床に変更
                    stageData[x][y] = 5;
                }
                var sound = game.assets[SE_WALK].clone();
                sound.play();
                playerX = x;
                playerY = y;
                dirty = 1;
                break;
            case 13:
                //  ゴールについた？
                var sound = game.assets[SE_GOAL].clone();
                sound.play();
                playerGoal = 1;
                changePlayerAnim(2);

                playerX = x;
                playerY = y;
                dirty = 1;
                break;
            } 
            
            dirty = breakBlock(x,y);                        
        }
    }
    
}

//	ステージデータを綺麗にする
function removeStageSprite(){
    for (var x = 0; x < stageSprite.length; x++){
        for (var y = 0; y < stageSprite[x].length; y++){
            stageSprite[x][y].parentNode.removeChild(stageSprite[x][y]);
        }
    }	

    //  プレイヤーも綺麗にする
    playerSprite.parentNode.removeChild(playerSprite);
    //  引っ越しお化けを綺麗にする
    ghostMove.parentNode.removeChild(ghostMove);
    //  ゴーストを綺麗にする
    removeGhostSprite();
    //  アイテムデータを綺麗にする
    removeItemSprite();
    //  木箱破壊を綺麗にする
    removeBreakBlock();
    //  キラキラエフェクトを綺麗にする
    removeItemEffect();
    //  スコア表示を綺麗にする
    removeScoreInfo();
    //  ライフを綺麗にする
    removeLife();
    //  ウィンドウを綺麗にする
    removeWindow();
    //  カーソルを綺麗にする
    removeArrowSprite();
}


//------------------------------------------------------------------------------------------------------------------
//  ゲーム本体の処理
//------------------------------------------------------------------------------------------------------------------
//  スクロールのフラグ
var isScroll = -1;
var BGM;
var isIE = -1;  //  IEで表示されているか？

// 画面の準備
function initGame() {

    enchant.Sound.enabledInMobileSafari = true
 	// ゲーム画面の作成
	game = new Core(WIDTH, HEIGHT);
		
	var left = ( window.innerWidth - ( game.width * game.scale ) ) / 2;
	$('#enchant-stage').css({
		"position":"absolute",
		"left":left+"px"
	});
	game._pageX = left;

	// fps
	game.fps = 30;
	
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf("msie") != -1 || ua.indexOf("trident") != -1)
    {
        isIE = 1;
        INGAME_BGM = './sounds/BGM.mp3';
        SE_OK = './sounds/SE_OK.mp3';
        SE_START = './sounds/SE_START.mp3';
        SE_BREAK = './sounds/SE_BREAK.mp3';
        SE_DAMAGE = './sounds/SE_DAMAGE.mp3';
        SE_WALK = './sounds/SE_WALK.mp3';
        SE_GET = './sounds/SE_GET.mp3';
        SE_CLEAR = './sounds/SE_CLEAR.mp3';
        SE_SCORE = './sounds/SE_SCORE.mp3';
        SE_GOAL = './sounds/SE_GOAL.mp3';
    }
    
	// 画像とサウンドのpreload
	game.preload( TITLE_LOGO, TITLE_PLAYER, 
                    START_LOGO,START_LOGO2,
                    BLOCK, BREAK_BLOCK, MAPCHIP03, MAPCHIP05,
                    BG_EASY, BG_NORMAL, BG_HARD, BG_LEFT01, BG_RIGHT01, BG_LEFT02, BG_RIGHT02, BG_LEFT03, BG_RIGHT03, BG_LASTLIFE,
                    BTN_EASY, BTN_NORMAL, BTN_HARD, BTN_TUTORIAL,
                    INFO_WINDOW,TITLE,
                    INFO_WINDOW_TIMER,
                    UI_LIFE, UI_SEC,
                    UI_SCORE, NUMBER, NUMBER_SMALL,
                    UI_ARROW,
                    PLAYER_ANIM,
                    ITEM, ITEM_EFFECT, ITEM_GLASS_WINDOW, ITEM_CANDY_WINDOW, ITEM_STAR_WINDOW, ITEM_BAR_WINDOW, ITEM_BAR,
                    GHOST,GHOST_EFFECT,
                    RESULT_BG, RESULT_CAPTION, RESULT_WINDOW, RESULT_REPLAY, RESULT_TITLE, RESULT_RANK, RESULT_KEEP,
                    BG_TUTORIAL, GAMEOVER_BG, GAMEOVER_CAPTION,
                    INGAME_BGM, SE_OK, SE_START, SE_BREAK, SE_DAMAGE, SE_WALK, SE_GET, SE_CLEAR, SE_SCORE, SE_GOAL); 


	// ロード時
	game.onload = function() {
		
		// サイズの通知とボタンの表示(enchant.jsでのリサイズが終わったので)
		if(window.parent != null){
			window.parent.$("#game").trigger("splashEndEvent");
			
			var gameW = $("#enchant-stage").width();
			window.parent.$("#game").trigger("updateGameSizeEvent",[gameW]);
		}
	
		// 通知
		function sendPage( page ){
			
			// 画面遷移把握用 (analyticsなどで使用)
			if( window.parent != null && typeof window.parent.activePage == "function"){
				// 画面遷移把握用( title や game や result などを送ってください)
				window.parent.activePage( page );
			}
		}

        BGM =game.assets[INGAME_BGM].clone();
		
		// トップのシーン（ステージセレクトを設置）
		var createTopScene = function(){
			
			// analytics
			sendPage("title");
			
			// シーン
			var scene = new Scene();

            //  スコアを初期化
            inGameScore = 0;
            prevStageScore = 0;
            blockBreakCount = 0;
            inGameTime = 0;
            //  ライフを初期化
            lifeCount = 3;

			// 背景
			var topSprite = new Sprite( WIDTH, HEIGHT );
			topSprite.image = game.assets[ TITLE ];
			scene.addChild( topSprite );
            
            //  ロゴ
            titleLogoSprite = new Sprite(TITLE_LOGO_WIDTH, TITLE_LOGO_HEIGHT);
			titleLogoSprite.image = game.assets[ TITLE_LOGO ];
			titleLogoSprite.x = 0;
			titleLogoSprite.y = 0;
			scene.addChild( titleLogoSprite );

			var titlePlayer = new Sprite(game.assets[ TITLE_PLAYER ].width, game.assets[ TITLE_PLAYER ].height);
			titlePlayer.image = game.assets[ TITLE_PLAYER ];
			titlePlayer.x = 430;
			titlePlayer.y = 430;
			scene.addChild( titlePlayer );
			
			// 初級
			var easy = new Sprite(game.assets[ BTN_EASY ].width,game.assets[ BTN_EASY ].height);
			easy.image = game.assets[ BTN_EASY ];
			easy.x = game.width/2 - easy.width/2 - 80;
			easy.y = 500 - 50;
			scene.addChild( easy );

			var easyCover = new Sprite(game.assets[ BTN_EASY ].width,game.assets[ BTN_EASY ].height);
			easyCover.image = game.assets[ BTN_EASY ];
			easyCover.x = game.width/2 - easyCover.width/2 - 80;
			easyCover.y = 500 - 50;
            easyCover.opacity = 1;
			scene.addChild( easyCover );

			// 中級
			var normal = new Sprite(game.assets[ BTN_NORMAL ].width,game.assets[ BTN_NORMAL ].height);
			normal.image = game.assets[ BTN_NORMAL ];
			normal.x = game.width/2 - normal.width/2 - 80;
			normal.y = easy.y + easy.height * 1.2;
			scene.addChild( normal );

			var normalCover = new Sprite(game.assets[ BTN_NORMAL ].width,game.assets[ BTN_NORMAL ].height);
			normalCover.image = game.assets[ BTN_NORMAL ];
			normalCover.x = game.width/2 - normalCover.width/2 - 80;
			normalCover.y = easy.y + easy.height * 1.2;
            normalCover.opacity = 1;
			scene.addChild( normalCover );

			// 上級
			var hard = new Sprite(game.assets[ BTN_HARD ].width,game.assets[ BTN_HARD ].height);
			hard.image = game.assets[ BTN_HARD ];
			hard.x = game.width/2 - hard.width/2 - 80;
			hard.y = normal.y + normal.height * 1.2;
			scene.addChild( hard );

			var hardCover = new Sprite(game.assets[ BTN_HARD ].width,game.assets[ BTN_HARD ].height);
			hardCover.image = game.assets[ BTN_HARD ];
			hardCover.x = game.width/2 - hardCover.width/2 - 80;
			hardCover.y = normal.y + normal.height * 1.2;
            hardCover.opacity = 1;
			scene.addChild( hardCover );

			// チュートリアル
			var tutorial = new Sprite(game.assets[ BTN_TUTORIAL ].width,game.assets[ BTN_TUTORIAL ].height);
			tutorial.image = game.assets[ BTN_TUTORIAL ];
			tutorial.x = game.width/2 - tutorial.width/2;
			tutorial.y = hard.y + hard.height * 1.4;
			scene.addChild( tutorial );

			var tutorialCover = new Sprite(game.assets[ BTN_TUTORIAL ].width,game.assets[ BTN_TUTORIAL ].height);
			tutorialCover.image = game.assets[ BTN_TUTORIAL ];
			tutorialCover.x = game.width/2 - tutorialCover.width/2;
			tutorialCover.y = hard.y + hard.height * 1.4;
			scene.addChild( tutorialCover );
			
            var goTutorial = -1;
            
            var opacity = 1;
            var scaleX = 1;
            var scaleY = 1;
            
			// タッチイベントを設定
			easyCover.addEventListener(Event.TOUCH_START, function(e) {
                if (gameLevel != -1)
                {
                    return;
                }    
				gameLevel = 0;
                var sound = game.assets[SE_OK].clone();
                sound.play();
			});
			normalCover.addEventListener(Event.TOUCH_START, function(e) {    
                if (gameLevel != -1)
                {
                    return;
                }    
				gameLevel = 1;
                var sound = game.assets[SE_OK].clone();
                sound.play();
			});
			hardCover.addEventListener(Event.TOUCH_START, function(e) {    
                if (gameLevel != -1)
                {
                    return;
                }    
				gameLevel = 2;
                var sound = game.assets[SE_OK].clone();
                sound.play();
			});
			tutorialCover.addEventListener(Event.TOUCH_START, function(e) {    
                var sound = game.assets[SE_OK].clone();
                sound.play();
                goTutorial = 1;
			});
            
            //	タイトルのメインループを登録
			scene.addEventListener('enterframe', function() {
                //  タイトル画面のアニメーション
                animTitleLogo();
                //  どれか選択された？
                if (gameLevel != -1 || goTutorial == 1)
                {
                    //  透明度をあげつつ拡大
                    if (opacity > 0)
                    {
                        opacity -= 0.1;
                        scaleX += 0.015;
                        scaleY += 0.015;
                    }

                    //  全部できったらシーン切り替え
                    if (opacity <= 0)
                    {
                        if (goTutorial == 1)
                        {
                            game.replaceScene( createTutorialScene() );                                            
                        } else {
                            game.replaceScene( createGameScene() );                
                        }
                    }

                    switch(gameLevel)
                    {
                        case 0:
                            easyCover.opacity = opacity;
                            easyCover.scaleX = scaleX;
                            easyCover.scaleY = scaleY;
                        break;
                        case 1:
                            normalCover.opacity = opacity;
                            normalCover.scaleX = scaleX;
                            normalCover.scaleY = scaleY;
                        break;
                        case 2:
                            hardCover.opacity = opacity;
                            hardCover.scaleX = scaleX;
                            hardCover.scaleY = scaleY;
                        break;
                    }
                    if (goTutorial == 1)
                    {
                        tutorialCover.opacity = opacity;
                        tutorialCover.scaleX = scaleX;
                        tutorialCover.scaleY = scaleY;
                    }

                }
			});

			return scene;
		};		

        //  チュートリアル
		var createTutorialScene = function(){
			// analytics
			sendPage("tutorial");

			// シーン
			var scene = new Scene();

			// 背景
			var bg = new Sprite( game.assets[ BG_TUTORIAL ].width,game.assets[ BG_TUTORIAL ].height );
			bg.image = game.assets[ BG_TUTORIAL ];
            bg.x = 0;
            bg.y = 0;
			scene.addChild( bg );

            //  タイトルへ戻るのボタン
			var toTitle = new Sprite( game.assets[ RESULT_TITLE ].width,game.assets[ RESULT_TITLE ].height );
			toTitle.image = game.assets[ RESULT_TITLE ];
            toTitle.x = WIDTH / 2 - toTitle.width /2;
            toTitle.y = 760;
			scene.addChild( toTitle );

            //  タイトルへ戻るのボタン
			var toTitleCover = new Sprite( game.assets[ RESULT_TITLE ].width,game.assets[ RESULT_TITLE ].height );
			toTitleCover.image = game.assets[ RESULT_TITLE ];
            toTitleCover.x = WIDTH / 2 - toTitleCover.width /2;
            toTitleCover.y = 760;
			scene.addChild( toTitleCover );

            var opacity = 1;
            var scaleX = 1;
            var scaleY = 1;

            var nextScene = -1;
            
			// タッチイベントを設定
			toTitleCover.addEventListener(Event.TOUCH_START, function(e) {
                var sound = game.assets[SE_OK].clone();
                sound.play();
                nextScene = 1;
			});

            //	ゲームオーバーのメインループを登録
			scene.addEventListener('enterframe', function() {
                //  どれか選択された？
                if (nextScene != -1)
                {
                    //  透明度をあげつつ拡大
                    if (opacity > 0)
                    {
                        opacity -= 0.1;
                        scaleX += 0.015;
                        scaleY += 0.015;
                    }

                    //  全部できったらシーン切り替え
                    if (opacity < 0)
                    {
                        game.replaceScene( createTopScene() );                
                    }

                    toTitleCover.opacity = opacity;
                    toTitleCover.scaleX = scaleX;
                    toTitleCover.scaleY = scaleY;
                }
            });

			return scene;
        };       

		
        //  ゲームオーバーのシーン
		var createGameOverScene = function(){
			// analytics
			sendPage("gameover");

			// シーン
			var scene = new Scene();
            BGM.stop();

			// 背景
			var bg = new Sprite( game.assets[ GAMEOVER_BG ].width,game.assets[ GAMEOVER_BG ].height );
			bg.image = game.assets[ GAMEOVER_BG ];
            bg.x = 0;
            bg.y = 0;
			scene.addChild( bg );

            //  リプレイへのボタン
			var replay = new Sprite( game.assets[ RESULT_REPLAY ].width,game.assets[ RESULT_REPLAY ].height );
			replay.image = game.assets[ RESULT_REPLAY ];
            replay.x = WIDTH / 2 - replay.width /2;
            replay.y = 700 - 120;
			scene.addChild( replay );

            //  リプレイへのボタン
			var replayCover = new Sprite( game.assets[ RESULT_REPLAY ].width,game.assets[ RESULT_REPLAY ].height );
			replayCover.image = game.assets[ RESULT_REPLAY ];
            replayCover.x = WIDTH / 2 - replayCover.width /2;
            replayCover.y = 700 - 120;
			scene.addChild( replayCover );

            //  タイトルへ戻るのボタン
			var toTitle = new Sprite( game.assets[ RESULT_TITLE ].width,game.assets[ RESULT_TITLE ].height );
			toTitle.image = game.assets[ RESULT_TITLE ];
            toTitle.x = WIDTH / 2 - toTitle.width /2;
            toTitle.y = 820 - 120;
			scene.addChild( toTitle );

            //  タイトルへ戻るのボタン
			var toTitleCover = new Sprite( game.assets[ RESULT_TITLE ].width,game.assets[ RESULT_TITLE ].height );
			toTitleCover.image = game.assets[ RESULT_TITLE ];
            toTitleCover.x = WIDTH / 2 - toTitleCover.width /2;
            toTitleCover.y = 820 - 120;
			scene.addChild( toTitleCover );

			var caption = new Sprite( game.assets[ GAMEOVER_CAPTION ].width,game.assets[ GAMEOVER_CAPTION ].height );
			caption.image = game.assets[ GAMEOVER_CAPTION ];
            caption.x = 0;
            caption.y = 0;
			scene.addChild( caption );

            var opacity = 1;
            var scaleX = 1;
            var scaleY = 1;

            var nextScene = -1;
            
            initScore(scene);

            var frameCount = 0;
            var isCountUp = -1;
            
            //  カウントアップ用
            resultScore = 0;
            var countUpRate = inGameScore / 10;
            countUpRate = Math.ceil(100);  //  最低でも100ずつ足す

			// タッチイベントを設定
			replayCover.addEventListener(Event.TOUCH_START, function(e) {
                var sound = game.assets[SE_OK].clone();
                sound.play();
                nextScene = 0;
			});

			toTitleCover.addEventListener(Event.TOUCH_START, function(e) {
                var sound = game.assets[SE_OK].clone();
                sound.play();
                nextScene = 1;
			});

            //  ゲームオーバーの広告  //游戏外套的广告
            // バインド
            // if(window.parent != null){
            //     // 押せなくしておく
            //     replayCover.touchEnabled = false;
            //     toTitleCover.touchEnabled = false;
                
            //     // yahooのリザルトが閉じた後
            //     window.parent.$("#result").on("resultCloseEvent",function close(){
            //         // イベント解除
            //         window.parent.$("#result").off("resultCloseEvent",close);
                    
            //         // 押せるように
            //         replayCover.touchEnabled = true;
            //         toTitleCover.touchEnabled = true;
            //     });
            // }
            
            // yahooのresult表示用(リザルト画面で呼んでください)
            // if( window.parent != null && typeof window.parent.showYahooResultAndScore == "function"){
            //     // yahooのresult表示用
            //     window.parent.showYahooResultAndScore( inGameScore );
            // }


            //	ゲームオーバーのメインループを登録
			scene.addEventListener('enterframe', function() {
                dispScoreInGameOver();

                if (isCountUp == -1)
                {
                    frameCount++;
                    if (frameCount > 2)
                    {
                        frameCount = 0;
                        resultScore += countUpRate;
                        var soundCount = game.assets[SE_SCORE].clone();
                        soundCount.play();

                        if (resultScore >= inGameScore)
                        {
                            isCountUp = 1;
                            resultScore = inGameScore;
                        }
                    }
                }

                //  どれか選択された？
                if (nextScene != -1)
                {
                    //  透明度をあげつつ拡大
                    if (opacity > 0)
                    {
                        opacity -= 0.1;
                        scaleX += 0.015;
                        scaleY += 0.015;
                    }

                    //  全部できったらシーン切り替え
                    if (opacity < 0)
                    {
                        if (nextScene == 0)
                        {
                            //  スコアを初期化
                            inGameScore = 0;
                            prevStageScore = 0;
                            blockBreakCount = 0;
                            inGameTime = 0;
                            //  ライフを初期化
                            lifeCount = 3;
                            // アイテム効果を初期化
                            isItemBuffOn = 0;
                            game.replaceScene( createGameScene() );                
                        }
                        else{
                            gameLevel = -1;	//	0...easy, 1...normal, 2...hard
                            game.replaceScene( createTopScene() );                
                        }
                    }

                    switch(nextScene)
                    {
                        case 0:
                            replayCover.opacity = opacity;
                            replayCover.scaleX = scaleX;
                            replayCover.scaleY = scaleY;
                        break;
                        case 1:
                            toTitleCover.opacity = opacity;
                            toTitleCover.scaleX = scaleX;
                            toTitleCover.scaleY = scaleY;
                        break;
                    }
                }
            });

			return scene;
        };       
        
		// リザルトのシーン
		var createResultScene = function(){
			
			// analytics
			sendPage("result");
			
            BGM.stop();
            
			// シーン
			var scene = new Scene();

			// 背景
			var bg = new Sprite( game.assets[ RESULT_BG ].width,game.assets[ RESULT_BG ].height );
			bg.image = game.assets[ RESULT_BG ];
            bg.x = 0;
            bg.y = 0;
			scene.addChild( bg );

            //  リザルト情報を出すウィンドウ
			var window = new Sprite( game.assets[ RESULT_WINDOW ].width,game.assets[ RESULT_WINDOW ].height );
			window.image = game.assets[ RESULT_WINDOW ];
            window.x = 0;
            window.y = 575 - 50;
			scene.addChild( window );

            //  CLEARの文字
			var caption = new Sprite( game.assets[ RESULT_CAPTION ].width,game.assets[ RESULT_CAPTION ].height );
			caption.image = game.assets[ RESULT_CAPTION ];
            caption.x = 0;
            caption.y = 0;
			scene.addChild( caption );

            //  リプレイへのボタン
			var replay = new Sprite( game.assets[ RESULT_KEEP ].width,game.assets[ RESULT_KEEP ].height );
			replay.image = game.assets[ RESULT_KEEP ];
            replay.x = WIDTH / 2 - replay.width /2;
            replay.y = 828 - 65;
			scene.addChild( replay );

            //  リプレイへのボタン
			var replayCover = new Sprite( game.assets[ RESULT_KEEP ].width,game.assets[ RESULT_KEEP ].height );
			replayCover.image = game.assets[ RESULT_KEEP ];
            replayCover.x = WIDTH / 2 - replayCover.width /2;
            replayCover.y = 828 - 65;
			scene.addChild( replayCover );

            //  時間の針            
            var timerSecText = new Sprite(game.assets[ UI_SEC ].width,game.assets[ UI_SEC ].height);
            timerSecText.image = game.assets[ UI_SEC ];
            timerSecText.x = 587;
            timerSecText.y = 668 - 32;
            timerSecText.scaleX = 0.6;
            timerSecText.scaleY = 0.6;
            scene.addChild( timerSecText );

            //  ハート
            var lifeIconX = 490;
            var lifeIconY = 738 - 50;
			var lifeIcon0 = new Sprite( LIFE_WIDTH, LIFE_HEIGHT );
			lifeIcon0.image = game.assets[ UI_LIFE ];
            lifeIcon0.x = lifeIconX + LIFE_WIDTH * 0;
            lifeIcon0.y = lifeIconY;
			scene.addChild( lifeIcon0 );

			var lifeIcon1 = new Sprite( LIFE_WIDTH, LIFE_HEIGHT );
			lifeIcon1.image = game.assets[ UI_LIFE ];
            lifeIcon1.x = lifeIconX + LIFE_WIDTH * 1;
            lifeIcon1.y = lifeIconY;
            if (lifeCount <= 1)
            {
                lifeIcon1.frame = 1;                
            }
			scene.addChild( lifeIcon1 );

			var lifeIcon2 = new Sprite( LIFE_WIDTH, LIFE_HEIGHT );
			lifeIcon2.image = game.assets[ UI_LIFE ];
            lifeIcon2.x = lifeIconX + LIFE_WIDTH * 2;
            lifeIcon2.y = lifeIconY;
            if (lifeCount <= 2)
            {
                lifeIcon2.frame = 1;                
            }
			scene.addChild( lifeIcon2 );
            
            //  タイトルへ戻るのボタン
            initScore(scene);
            initTimeInResult(scene);
            initBonus(scene);
            initBreakBlockCount(scene);

            var selectScene = -1;   //  0...title, 1...game
            
            var frameCount = 0;
            var isCountUp = -1;
            
            var opacity = 1;
            var scaleX = 1;
            var scaleY = 1;

            //  タイムによるスコアを加算
            bonusScore = calcTimeBonus();
            inGameScore += bonusScore;
            
            //  カウントアップ用
            resultScore = prevStageScore;    //  １個前のスコアからスタート
            var countUpRate = inGameScore / 10;
            countUpRate = Math.ceil(100);  //  最低でも100ずつ足す

            //  クリア音をならす
            var soundClear = game.assets[SE_CLEAR].clone();
            soundClear.play();

			replayCover.addEventListener(Event.TOUCH_START, function(e) {
                if (selectScene != -1)
                {
                    return;
                }
                var sound = game.assets[SE_OK].clone();
                sound.play();
                selectScene = 0;
			});

            //  リザルト画面での広告   //结果画面的广告
            // バインド
            // if(window.parent != null){
            //     // 押せなくしておく
            //     replayCover.touchEnabled = false;
                
            //     // yahooのリザルトが閉じた後
            //     window.parent.$("#game").on("spResultAdEndEvent",function close(){
            //         // イベント解除
            //         window.parent.$("#game").off("spResultAdEndEvent",close);
                    
            //         // 押せるように
            //         replayCover.touchEnabled = true;
            //     });
            // }
            
            // 広告表示用(リザルト画面で呼んでください)
            // if( window.parent != null && typeof window.parent.showYahooResultAdOnly == "function"){
            //     // 広告表示用
            //     window.parent.showYahooResultAdOnly();
            // }
        
            //	リザルトのメインループを登録
			scene.addEventListener('enterframe', function() {
                dispScoreInResult();
                dispTimeInResult();
                dispBonusInResult();                
                dispBreakBlockCount();

                if (isCountUp == -1)
                {
                    frameCount++;
                    if (frameCount > 1)
                    {
                        frameCount = 0;
                        resultScore += countUpRate;
                        var soundCount = game.assets[SE_SCORE].clone();
                        soundCount.play();

                        if (resultScore >= inGameScore)
                        {
                            isCountUp = 1;
                            resultScore = inGameScore;
                            prevStageScore = resultScore;
                        }
                    }
                }
                
                //  行き先ボタンの演出
                if (selectScene != -1)
                {
                    //  透明度をあげつつ拡大
                    if (opacity > 0)
                    {
                        opacity -= 0.1;
                        scaleX += 0.015;
                        scaleY += 0.015;
                    }

                    //  全部できったらシーン切り替え
                    if (opacity < 0)
                    {
                        if (selectScene == 0)
                        {
                            // アイテム効果を初期化
                            isItemBuffOn = 0;
                            game.replaceScene( createGameScene() );                                            
                        }
                        else {
                            gameLevel = -1;	//	0...easy, 1...normal, 2...hard
                            game.replaceScene( createTopScene() );                                                                        
                        }
                    }

                    switch(selectScene)
                    {
                        case 0:
                            replayCover.opacity = opacity;
                            replayCover.scaleX = scaleX;
                            replayCover.scaleY = scaleY;
                        break;
                        case 1:
                            toTitleCover.opacity = opacity;
                            toTitleCover.scaleX = scaleX;
                            toTitleCover.scaleY = scaleY;
                        break;
                    }
                    
                }
			});

			return scene;
		};		

		
		//	ゲームメインループ
		function gameMainLoop(){
            if (isStartAnimPlaying == 0)
            {
                if(!BGM.src)
                {
                    BGM.play();
                }
            }

            if (dirty == 1)
            {
                dirty = -1;
                removeStageSprite();
                initStage(game.currentScene);
            }
            movePlayer();
            runArrowSprite();
            SetShakeBox();
            SetGhostMove();
            DoGhostMove();
            moveEffectGhost();
            timerEffect.rotate(8);
            animScoreInfo();
            animBreakBlock();
            animItemEffect();
            animPlayer();
            animStartLogo();
            animGhost();
            animItemBuffWindow();
            animLife();
            dispScoreInGame();
            addTime();
            dispTimeInGame();
			scrollMap();
            if (isClear >= 2)
            {
                game.replaceScene( createResultScene() );                
            }
            if (isGameOver != -1)
            {
                game.replaceScene( createGameOverScene() );                
            }
		}

		// ゲームのシーン
		var createGameScene = function(){
			
			// analytics
			sendPage("game");
			
			// シーン
			var scene = new Scene();

            //  クリアフラグを初期化
            isClear = -1;
            isGameOver = -1;

            //	スクロール用座標の初期化
			scrollX = 0;
			scrollY = 0;
            
            //  背景の初期化		            
            initBG(scene);
            //  賑やかしお化け
            initEffectGhost(scene);
            initCliff(scene);

            //  スコアの初期化
            initScore(scene);
            initTime(scene);

            //  ブロック破壊アニメーション
            initBreakBlock();
            //  キラキラエフェクト
            initItemEffect();
            
            //  スコアゲット表示
            initScoreInfo();
			
			//	ゲーム難易度によるパラメータの設定
			initGameParam(gameLevel);
			
			generateStage(gameLevel);
            
            //  最短路検索用のデータ初期化
            initPathData();
            //  お化けのアニメーション初期化
            initAnimGhost();

            //  プレイヤーの初期化
            playerGoal = 0;
            initAnimPlayer();

			//	ステージの初期化
			initStage(scene);            

            //  スタートロゴ準備
            initStartLogoAnim(scene);
            startStartLogo();

            gameMainLoop();

			//	ゲーム中のスクロール処理(画面外に移動させた時の処理が必要)
			scene.addEventListener(Event.TOUCH_START, function(event) {
				mouseX = event.x;
				mouseY = event.y;
			});
			scene.addEventListener(Event.TOUCH_MOVE, function(event) {
                //  スクロール中じゃなければ反応
                if (isArrowTouched == -1 && gameLevel != 0)
                {
                    isScroll = 1;
                    scrollX -= mouseX - event.x;
                    scrollY -= mouseY - event.y;
                    clampScrollXY();                    
                    mouseX = event.x;
                    mouseY = event.y;
                }				
			});
			scene.addEventListener(Event.TOUCH_END, function(event) {
				mouseX = event.x;
				mouseY = event.y;                
                onMouse();
                isScroll = -1;
			});
			
			//	ゲームのメインループを登録
			scene.addEventListener('enterframe', function() {
	          gameMainLoop();
			});

			return scene;
		};
				
		game.replaceScene( createTopScene() );
	}
	
	// ゲームをスタートさせます
	game.start();
};