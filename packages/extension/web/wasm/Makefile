dependencies:
	@/bin/echo  "[NoiseExplorer] Installing dependencies..."
	@curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
	@/bin/echo " OK."

bundler:
	@/bin/echo  "[NoiseExplorer] Compiling Bundler friendly WASM Module..."
	@wasm-pack build --target bundler --release --scope noiseexplorer_ix_wasm
	@/bin/echo " OK."

nodejs:
	@/bin/echo  "[NoiseExplorer] Compiling Node friendly WASM Module..."
	@wasm-pack build --target nodejs --release --scope noiseexplorer_ix_wasm
	@/bin/echo " OK."

no-modules:
	@/bin/echo  "[NoiseExplorer] Compiling WASM Module..."
	@wasm-pack build --target no-modules --release --scope noiseexplorer_ix_wasm
	@/bin/echo " OK."

web:
	@/bin/echo  "[NoiseExplorer] Compiling WASM Module..."
	@wasm-pack build --target web --release --scope noiseexplorer_ix_wasm
	@/bin/echo " OK."

test:
	@/bin/echo  "[NoiseExplorer] Running tests..."
	@wasm-pack test --firefox
	@/bin/echo " OK."

test-headless-chrome:
	@/bin/echo  "[NoiseExplorer] Running tests in headless mode..."
	@wasm-pack test --chrome --headless
	@/bin/echo " OK."

test-headless-firefox:
	@/bin/echo  "[NoiseExplorer] Running tests in headless mode..."
	@wasm-pack test --firefox --headless
	@/bin/echo " OK."

test-headless-safari:
	@/bin/echo  "[NoiseExplorer] Running tests in headless mode..."
	@wasm-pack test --safari --headless
	@/bin/echo " OK."

test-nodejs:
	@/bin/echo "[NoiseExplorer] Running tests..."
	@wasm-pack test --node
	@/bin/echo " OK."

clean:
	@/bin/echo -n "[NoiseExplorer] Cleaning up..."
	@rm -rf pkg/ target/
	@rm -f Cargo.lock
	@/bin/echo " OK."