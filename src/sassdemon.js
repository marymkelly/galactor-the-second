const { execFile, spawn } = require('child_process');
const controller = new AbortController();
const { signal } = controller;

const green = "\x1b[32m"
const red = "\x1b[31m"
const reset = "\x1b[0m"

const sassChild = function () {
	
	const compileSass = execFile('sass', ['--watch', '--color', 'src/public/css/scss/styles.scss', 'src/public/css/styles.css'], {
		// stdio: ['pipe', 'pipe', 'pipe']  //depends on use of spawn
		signal
	});

	compileSass.stdout.on('data', function (data) {
		const text = data.toString('utf8').trim();
		console.log(`${green}[sass] ${text} ${reset}`);  //print to console
		return compileSass
	})

	compileSass.stderr.on('data', function (error) {
		const text = error.toString('utf8').trim()
		console.error(`${red}[sass] ${text}  ${reset}`)  //print to console
		controller.abort();
		throw error(error);
	})
}

module.exports = sassChild