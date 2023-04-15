<template>
  <div class="container-fluid p-2">
    <div class="border p-2">
      <h1 class="px-2 border-bottom">
        Wave Function Collapse
      </h1>
      <div class="row">
        <div class="col-md-3 col-lg-2">
          <button class="btn btn-primary my-2"
                  type="button"
                  @click="handleGenerate"
                  :disabled="loading">
            Generate
          </button>
          <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" v-model="instant" id="instantInput" checked>
            <label class="form-check-label" for="instantInput">
              Instant
            </label>
          </div>
          <div class="mb-2">
            <label for="resolutionWidthInput"
                   class="form-label">
              Resolution width (px)
            </label>
            <input v-model.number="resolutionWidth"
                   class="form-range"
                   type="range"
                   min="1"
                   :max="maxResolutionWidth">
            <input v-model.number="resolutionWidth"
                   class="form-control"
                   id="resolutionWidthInput"
                   type="number"
                   min="1">
          </div>
          <div class="mb-2">
            <label for="resolutionHeightInput"
                   class="form-label">
              Resolution height (px)
            </label>
            <input v-model.number="resolutionHeight"
                   class="form-range"
                   type="range"
                   min="1"
                   :max="maxResolutionHeight">
            <input v-model.number="resolutionHeight"
                   class="form-control"
                   id="resolutionHeightInput"
                   type="number"
                   min="1">
          </div>
          <div class="mb-2">
            <label for="gridColumnsInput"
                   class="form-label">
              Grid columns
            </label>
            <input v-model.number="gridColumns"
                   class="form-control"
                   id="gridColumnsInput"
                   type="number"
                   min="1">
          </div>
          <div class="mb-2">
            <label for="gridRowsInput"
                   class="form-label">
              Grid rows
            </label>
            <input v-model.number="gridRows"
                   class="form-control"
                   id="gridRowsInput"
                   type="number"
                   min="1">
          </div>
          <div class="mb-2">
            <label for="backgroundColorInput"
                   class="form-label">
              Background color
            </label>
            <input v-model="backgroundColor"
                   class="form-control"
                   id="backgroundColorInput"
                   type="text">
          </div>
          <div class="mb-2">
            <label for="strokeColorInput"
                   class="form-label">
              Stroke color
            </label>
            <input v-model="strokeColor"
                   class="form-control"
                   id="strokeColorInput"
                   type="text">
          </div>
          <div class="mb-2">
            <label for="strokeWeightInput"
                   class="form-label">
              Stroke weight
            </label>
            <input v-model.number="strokeWeight"
                   class="form-control"
                   id="strokeWeightInput"
                   type="number"
                   min="1">
          </div>
          <p v-if="resolutionWidth > maxResolutionWidth || resolutionHeight > maxResolutionHeight">
            Careful //@todo
          </p>
          <div class="mb-2">
            <label for="maxFramerateInput"
                   class="form-label">
              Max framerate
            </label>
            <input v-model.number="maxFramerate"
                   class="form-control"
                   id="maxFramerateInput"
                   type="number"
                   min="1"
                   :disabled="instant">
          </div>
          <div class="mb-2">
            <label for="framerateInput"
                   class="form-label">
              Current framerate
            </label>
            <input :value="framerate"
                   class="form-control"
                   id="framerateInput"
                   readonly>
          </div>
        </div>
        <div class="vr p-0"></div>
        <div class="col-md-3 col-lg-2">
          <button class="btn btn-primary my-2"
                  type="button"
                  @click="handleRandomizeTilesetWeights">
            Randomize weights
          </button>
          <div v-for="(tile, tileIndex) in tileset" :key="tileIndex" class="mb-2">
            <label class="form-label">
              {{ tile.name }} ({{ tile.weight }})
            </label>
            <input :value="tile.weight"
                   @input="handleWeightInput($event.target.value, tileIndex)"
                   class="form-range"
                   type="range"
                   min="1"
                   :max="maxTileWeight">
          </div>
        </div>
        <div class="vr p-0"></div>
        <div class="col">
          <div v-show="!loading" class="h-100 w-100 overflow-scroll position-relative">
            <div ref="p5canvas" class="position-absolute">
            </div>
          </div>
          <div v-if="loading"
               class="d-flex justify-content-center align-items-center h-100">
            <div class="spinner-border"
                 style="width: 5rem; height: 5rem;"
                 role="status">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ClosedTile,
  CornerTile, CrossDiagonalTile,
  CrossTile,
  DiagonalCornerTile, EmptyTile,
  EndTile,
  StraightTile,
  TTile, VTile
} from "../WaveFunctionCollapse/Tileset";
import WaveFunctionCollapse from "../WaveFunctionCollapse/WaveFunctionCollapse";
import p5 from "p5";
import p5Sketch from "../WaveFunctionCollapse/p5Sketch";

let waveFunctionCollapse = null;
let p5SketchInstance = null;
let p5Instance = null;
let tileset = null;
export default {
  name: "Index",
  data: () => (
      {
        loading: false,
        maxTileWeight: 100,
        maxResolutionWidth: 1000,
        maxResolutionHeight: 1000,
        resolutionWidth: 1000,
        resolutionHeight: 1000,
        maxGridColumns: 200,
        maxGridRows: 200,
        gridColumns: 100,
        gridRows: 100,
        backgroundColor: '#fff',
        strokeColor: '#000',
        strokeWeight: 1,
        instant: true,
        maxFramerate: 140,
        tileset: [],
        framerate: 0,
      }
  ),
  created() {
    this.resetTileset();
  },
  methods: {
    handleWeightInput(weight, tileIndex) {
      const newValue = parseInt(weight);
      tileset[tileIndex].weight = newValue;
      this.tileset[tileIndex].weight = newValue;
    },
    handleGenerate() {
      this.loading = true;
      this.$forceUpdate();
      // It seems that force update, next tick do not work to render the loading
      setTimeout(() => {
        this.performWaveFunctionCollapse();
      }, 100);
    },
    performWaveFunctionCollapse() {
      waveFunctionCollapse = new WaveFunctionCollapse(this.gridRows, this.gridColumns, tileset);
      if (this.instant) {
        waveFunctionCollapse.collapse();
      }
      this.loading = false;
      const config = {
        resolutionWidth: this.resolutionWidth,
        resolutionHeight: this.resolutionHeight,
        backgroundColor: this.backgroundColor,
        maxFramerate: this.maxFramerate,
        strokeColor: this.strokeColor,
        strokeWeight: this.strokeWeight
      }
      if (!p5Instance) {
        p5Instance = new p5((p) => {
          p5SketchInstance = new p5Sketch(p, config, this.iterateWaveFunctionCollapse)
          p.setup = () => p5SketchInstance.setup();
          p.draw = () => p5SketchInstance.draw();
        }, this.$refs.p5canvas)
      } else {
        p5SketchInstance.config = config;
        p5Instance.setup();
      }
      p5SketchInstance.p.loop()
    },
    iterateWaveFunctionCollapse(p) {
      this.framerate = Math.round((1000 / p.deltaTime) * 10) / 10;
      if (!this.instant) {
        waveFunctionCollapse.iterate();
      }
      return waveFunctionCollapse.getCells();
    },
    resetTileset() {
      tileset = [
        new StraightTile(),
        new CornerTile(),
        new CrossTile(),
        new TTile(),
        new ClosedTile(),
        new EndTile(),
        new DiagonalCornerTile(),
        new EmptyTile(),
        new CrossDiagonalTile(),
        new VTile(),
      ];
      for (let tilesetIndex in tileset) {
        this.tileset.push({
          name: tileset[tilesetIndex].constructor.name,
          weight: tileset[tilesetIndex].weight,
        });
      }
    },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    handleRandomizeTilesetWeights() {
      let randomPool = this.maxTileWeight;
      let randoms = [];
      for (let i = 0; i < tileset.length; i++) {
        let random = Math.floor(Math.random() * randomPool);
        randomPool -= random;
        random = random ? random : 1;
        randoms.push(random);
      }
      randoms = this.shuffle(randoms);
      for (let tileIndex in tileset) {
        this.handleWeightInput(randoms[tileIndex], tileIndex)
      }
    }
  }
}
</script>
