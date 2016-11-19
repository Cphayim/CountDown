var WINDOW_WIDTH; //画布宽高
var WINDOW_HEIGHT;
var RADIUS; //半径
var MARGIN_TOP; //每个数字距离画布的上边距
var MARGIN_LEFT; //第一个数字距离画布的左边距

/*
 * 一小时倒计时效果所用参数
 */
const endTime = new Date();
endTime.setHours(endTime.getHours()+1);
var curShowTimeSeconds = 0; //当前秒数
var balls = [];
const colors = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900', '#FFBB33', '#FF8800', '#FF4444', '#CC0000'];

WINDOW_WIDTH = document.documentElement.clientWidth;
WINDOW_HEIGHT = document.documentElement.clientHeight;
MARGIN_LEFT = WINDOW_WIDTH/10;
RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1;
MARGIN_TOP = WINDOW_HEIGHT/5;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;
curShowTimeSeconds = getCurShowTimeSeconds();

setInterval(function() {
	render(context);
	update();
}, 50);

/**
 * 更新时间
 */
function update() {
	var nextShowTimeSeconds = getCurShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds / 3600); //小时
	var nextMinutes = parseInt(nextShowTimeSeconds % 3600 / 60); //分钟
	var nextSeconds = nextShowTimeSeconds % 60; //秒钟

	var curHours = parseInt(curShowTimeSeconds / 3600); //小时
	var curMinutes = parseInt(curShowTimeSeconds % 3600 / 60); //分钟
	var curSeconds = curShowTimeSeconds % 60; //秒钟	

	if (nextSeconds != curSeconds) {
		if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
			addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
		}
		if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
			addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
		}
		if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
			addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
		}
		if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
			addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
		}
		if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
			addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
		}
		if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
			addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
		}
		curShowTimeSeconds = nextShowTimeSeconds;
	}

	updateBalls();
}

/**
 * 更新运动小球状态
 */
function updateBalls() {
	//自由落体
	for (var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx;
		balls[i].y += balls[i].vy;
		balls[i].vy += balls[i].g;
		//碰撞检测
		if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
			balls[i].y = WINDOW_HEIGHT - RADIUS; //确保不陷入
			balls[i].vy = -balls[i].vy * 0.75; //反弹
		}
	}

	//性能优化
	var cnt = 0; //屏幕中的小球数量
	for (var i = 0; i < balls.length; i++) {
		if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
			balls[cnt++] = balls[i];
		}
	}
	while(balls.length>cnt){
		balls.pop();
	}
//	console.log(cnt)
}

/**
 * 添加运动小球
 * @param {Object} x
 * @param {Object} y
 * @param {Object} num
 */
function addBalls(x, y, num) {
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {
				var aBall = {
					x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
					y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
					g: 1.5 + Math.random(),
					vx: Math.pow(-1, Math.ceil(Math.random() * 10)) * 4,
					vy: -10,
					color: colors[Math.floor(Math.random() * colors.length)]
				}
				balls.push(aBall);
			}
		}
	}
}

/**
 * 获得当前剩余总秒数
 */
function getCurShowTimeSeconds() {
	var curTime = new Date();
	/*
	 * 一小时倒计时效果所用参数
	 */
	var ret = endTime.getTime() - curTime.getTime(); //剩余毫秒数
	ret = Math.round(ret / 1000); //毫秒->秒
	return ret >= 0 ? ret : 0;
	
}

/**
 * 绘制时间与运动小球
 * @param {Object} cxt context
 */
function render(cxt) {

	cxt.clearRect(0, 0, cxt.canvas.width, cxt.canvas.height); //清理画布

	var hours = parseInt(curShowTimeSeconds / 3600); //小时
	var minutes = parseInt(curShowTimeSeconds % 3600 / 60); //分钟
	var seconds = curShowTimeSeconds % 60; //秒钟

	//绘制时间
	//数字所占宽度为 (2*7+1)*(RADIUS+1) = 15*(RADIUS+1),:所占宽度为(2*4+1)*(RADIUS+1) = 9*(RADIUS+1)
	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
	renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);
	renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
	renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
	renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
	renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
	renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
	renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);//RADIUS = windowWIDTH*4/5/108-1 

	//绘制运动小球
	for (var i = 0; i < balls.length; i++) {
		cxt.beginPath();
		cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI);
		cxt.closePath();
		cxt.fillStyle = balls[i].color;
		cxt.fill();
	}
}

/**
 * 绘制数字
 * @param {Object} x 数字空间左上角x坐标
 * @param {Object} y 数字空间左上角y坐标
 * @param {Object} num 绘制的数字
 * @param {Object} cxt context
 */
function renderDigit(x, y, num, cxt) {
	cxt.fillStyle = 'rgb(0,102,153)';

	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if (digit[num][i][j] == 1) {

				cxt.beginPath();
				/*
				 * 圆心(centerX, centerY) RADIUS+1 表示圆和圆所在的小方块边界保留1的空隙
				 * centerX = x + j * 2 * (RADIUS + 1) + (RADIUS + 1)
				 * centerY = y + i * 2 * (RADIUS + 1) + (RADIUS + 1)
				 * 半径 RADIUS
				 * 起始弧度 0 
				 * 结束弧度 2PI
				 */
				cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
				cxt.closePath();

				cxt.fill();
			}
		}
	}
}