class Game {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.hdg = 0;
		this.speed = 0;
		this.accelerating = false;
		this.braking = false;
		this.turningRight = false;
		this.turningLeft = false;
	}

	update(dt) {
		if (this.accelerating) {
			this.speed += 1;
		}

		if (this.braking) {
			this.speed -= 1;
		}

		if (this.turningRight) {
			let hdg = (this.hdg + 5) % 360;
			if (hdg > 360) {
				hdg = hdg - 360;
			}
			this.hdg = hdg;
		}

		if (this.turningLeft) {
			let hdg = (this.hdg - 5) % 360;
			if (hdg < 0) {
				hdg = hdg + 360;
			}
			this.hdg = hdg;
		}

		this.x += (this.speed * dt / 1000) * Math.cos(this.hdg * 2 * Math.PI / 360);
		this.y += (this.speed * dt / 1000) * Math.sin(this.hdg * 2 * Math.PI / 360);
	}

	onKeyDown(event) {
		if (event.key === 'ArrowUp' && !event.repeat) {
			this.accelerating = true;
		} else if (event.key === 'ArrowDown' && !event.repeat) {
			this.braking = true;
		} else if (event.key === 'ArrowRight' && !event.repeat) {
			this.turningRight = true;
		} else if (event.key === 'ArrowLeft' && !event.repeat) {
			this.turningLeft = true;
		}
	}

	onKeyUp(event) {
		if (event.key === 'ArrowUp' && !event.repeat) {
			this.accelerating = false;
		} else if (event.key === 'ArrowDown' && !event.repeat) {
			this.braking = false;
		} else if (event.key === 'ArrowRight' && !event.repeat) {
			this.turningRight = false;
		} else if (event.key === 'ArrowLeft' && !event.repeat) {
			this.turningLeft = false;
		}
	}
};

class GameRenderer {
	constructor(game, canvas) {
		this.game = game;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}

	render() {
		// Clear the viewport
		this.ctx.fillStyle = 'rgb(0, 0, 0)';
		this.ctx.fillRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);

		// Draw UI
		this.ctx.strokeStyle = 'rgb(93, 188, 210)';
		this.ctx.fillStyle = 'rgb(93, 188, 210)';
		this.ctx.rect(10, 10, 120, 130);
		this.ctx.stroke();
		this.ctx.font = '20px monospace';
		this.ctx.fillText(`X:   ${Math.round(this.game.x)}`, 15, 35);
		this.ctx.fillText(`Y:   ${Math.round(this.game.y)}`, 15, 65);
		this.ctx.fillText(`Hdg: ${this.game.hdg}`, 15, 95);
		this.ctx.fillText(`S:   ${Math.round(this.game.speed)}`, 15, 125);

		// Draw character
		let x = this.canvas.offsetWidth / 2 + this.game.x * 10;
		let y = this.canvas.offsetHeight / 2 + this.game.y * 10;
		let hdgRads = this.game.hdg * 2 * Math.PI / 360;

		this.ctx.beginPath();
		this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
		this.ctx.fill();

		this.ctx.strokeStyle = 'rgb(255, 0, 0)';
		this.ctx.beginPath();
		this.ctx.arc(x, y, 10, hdgRads - Math.PI / 4, hdgRads + Math.PI / 4);
		this.ctx.stroke();
	}
}

// Initialize the canvas
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize the game and renderer
const game = new Game();
const renderer = new GameRenderer(game, canvas);

// Initialize key listeners
document.addEventListener('keydown', game.onKeyDown.bind(game));
document.addEventListener('keyup', game.onKeyUp.bind(game));

let previousTime = 0.0;

const loop = time => {
	const dt = time - previousTime;
	previousTime = time;

	// update
	game.update(dt);

	// render
	renderer.render();

	// repeat
	window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(time => {
	previousTime = time;
	loop(time);
});
