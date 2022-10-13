const WINDOW_WIDTH = 1024;
const WINDOW_HEIGHT = 468;
const MARGIN_LEFT = 30;
const RADIUS = 8;

var balls = [];
const colors = ["#78dce8", "#a9c54c", "#ff6188", "#f2a1f1", "#06a3d7"];

window.onload = function () {
  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");

  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;

  let date = getTime();
  let setDate = (curDate) => {
    date = curDate;
  };
  // setInterval(() => {
  //   render(context);
  //   update(date, setDate);
  // }, 50);

  (function animloop() {
    render(context);
    update(date, setDate);
    clock();
    window.requestAnimationFrame(animloop);
  })();
};

function getTime() {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()];
}

function update(date, setDate) {
  const [currentHour, currentMinute, currentSecond] = date;
  const [nextHour, nextMinute, nextSecond] = getTime();
  updateBalls();
  if (currentHour !== nextHour) {
    if (parseInt(currentHour / 10) !== parseInt(nextHour / 10)) {
      addBalls(MARGIN_LEFT + 0 * (RADIUS + 1), 0, parseInt(currentHour / 10));
    }
    if (parseInt(currentHour % 10) !== parseInt(nextHour % 10)) {
      addBalls(MARGIN_LEFT + 14 * (RADIUS + 1), 0, parseInt(currentHour % 10));
    }
  }
  if (currentMinute !== nextMinute) {
    if (parseInt(currentMinute / 10) !== parseInt(nextMinute / 10)) {
      addBalls(
        MARGIN_LEFT + 38 * (RADIUS + 1),
        0,
        parseInt(currentMinute / 10)
      );
    }
    if (parseInt(currentMinute % 10) !== parseInt(nextMinute % 10)) {
      addBalls(
        MARGIN_LEFT + 54 * (RADIUS + 1),
        0,
        parseInt(currentMinute % 10)
      );
    }
  }
  if (currentSecond !== nextSecond) {
    if (parseInt(currentSecond / 10) !== parseInt(nextSecond / 10)) {
      addBalls(
        MARGIN_LEFT + 78 * (RADIUS + 1),
        0,
        parseInt(currentSecond / 10)
      );
    }
    if (parseInt(currentSecond % 10) !== parseInt(nextSecond % 10)) {
      addBalls(
        MARGIN_LEFT + 92 * (RADIUS + 1),
        0,
        parseInt(currentSecond % 10)
      );
    }
    setDate([nextHour, nextMinute, nextSecond]);
  }
}

function render(ctx) {
  ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
  let numArr = getTime();
  for (let i = 0; i < numArr.length; i++) {
    let current = numArr[i];
    let renderArr =
      current < 10 ? [0, current] : [parseInt(current / 10), current % 10];
    renderArr.forEach((num, index) =>
      renderDigit(
        MARGIN_LEFT + i * 38 * (RADIUS + 1) + index * 16 * (RADIUS + 1),
        0,
        num,
        ctx
      )
    );
    if (i != numArr.length - 1) {
      renderDigit(
        MARGIN_LEFT + 30 * (RADIUS + 1) + i * 38 * (RADIUS + 1),
        0,
        10,
        ctx
      );
    }
  }

  balls.forEach((ball) => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, RADIUS, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  });
}

function renderDigit(x, y, number, ctx) {
  let numArr = digitalLattice[number];
  ctx.fillStyle = "#78dce8";
  for (let i = 0; i < numArr[0].length; i++) {
    for (let j = 0; j < numArr.length; j++) {
      if (numArr[j][i]) {
        ctx.beginPath();
        ctx.arc(
          x + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          y + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          RADIUS,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        ctx.fill();
      }
    }
  }
}

function addBalls(x, y, number) {
  let numArr = digitalLattice[number];
  for (let i = 0; i < numArr[0].length; i++) {
    for (let j = 0; j < numArr.length; j++) {
      if (numArr[j][i]) {
        var aBall = {
          x: x + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          y: y + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          g: 1.5 + Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
          vy: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        balls.push(aBall);
      }
    }
  }
}

// 批量更新小球的位置
function updateBalls() {
  balls.forEach((ball) => {
    if (ball.x + RADIUS > 0 && ball.x - RADIUS < WINDOW_WIDTH) {
      ball.x += ball.vx + Math.random() * 4;
      ball.y += ball.vy;
      ball.vy += ball.g;
      if (ball.y >= WINDOW_HEIGHT - RADIUS) {
        ball.y = WINDOW_HEIGHT - RADIUS;
        ball.vy = -ball.vy * 0.75;
      }
    }
  });

  // 移除屏幕之外的小球
  let count = 0;
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
      balls[count++] = balls[i];
    }
  }
  while (balls.length > Math.min(count, 300)) {
    balls.pop();
  }
}
