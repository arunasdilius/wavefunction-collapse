<template>
  <div class="container-fluid py-3">
    <div class="border p-3">
      <h1>
        Wave Function Collapse
      </h1>
      <div class="row border-top">
        <div class="col-md-3 col-lg-2">
          <div class="mb-3">
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
          <div class="mb-3">
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
          <div class="mb-3">
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
          <div class="mb-3">
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
          <div class="mb-3">
            <label for="backgroundColorInput"
                   class="form-label">
              Background color
            </label>
            <input v-model="backgroundColor"
                   class="form-control"
                   id="backgroundColorInput"
                   type="text">
          </div>
          <div class="mb-3">
            <label for="strokeColorInput"
                   class="form-label">
              Stroke color
            </label>
            <input v-model="strokeColor"
                   class="form-control"
                   id="strokeColorInput"
                   type="text">
          </div>
          <div class="mb-3">
            <label for="strokeWeightInput"
                   class="form-label">
              Stroke color
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
          <div class="mb-3">
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
          <div class="mb-3">
            <label for="framerateInput"
                   class="form-label">
              Current framerate
            </label>
            <input :value="framerate"
                   class="form-control"
                   id="framerateInput"
                   readonly>
          </div>
          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" v-model="instant" id="instantInput" checked>
            <label class="form-check-label" for="instantInput">
              Instant
            </label>
          </div>
          <div v-for="(tile, tileIndex) in tileset" :key="tileIndex" class="mb-3">
            <label class="form-label">
              {{ tile.constructor.name }} ({{ tile.weight }})
            </label>
            <input v-model.number="tile.weight"
                   class="form-range"
                   type="range"
                   min="1"
                   :max="maxTileWeight">
          </div>
          <button class="btn btn-primary"
                  type="button"
                  @click="handleRandomizeTilesetWeights">
            Randomize weights
          </button>
          <button class="btn btn-primary"
                  type="button"
                  @click="handleGenerate">
            Generate
          </button>
        </div>
        <div class="vr p-0"></div>
        <div class="col overflow-scroll" ref="p5canvas">
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

export default {
  name: "Index",
  data: () => (
      {
        maxTileWeight: 100,
        maxResolutionWidth: 1000,
        maxResolutionHeight: 1000,
        resolutionWidth: 800,
        resolutionHeight: 800,
        maxGridColumns: 200,
        maxGridRows: 200,
        gridColumns: 50,
        gridRows: 50,
        backgroundColor: '#fff',
        strokeColor: '#000',
        strokeWeight: 1,
        instant: false,
        maxFramerate: 140,
        tileset: [],
        waveFunctionCollapse: null,
        p5: null,
        framerate: 0,
      }
  ),
  created() {
    this.resetTileset();
  },
  methods: {
    handleGenerate() {
      this.waveFunctionCollapse = new WaveFunctionCollapse(this.gridRows, this.gridColumns, this.tileset);
      if (this.instant) {
        this.waveFunctionCollapse.collapse();
      }
      if(!this.p5){
        this.p5 = new p5((p) => {
          const config = {
            resolutionWidth: this.resolutionWidth,
            resolutionHeight: this.resolutionHeight,
            backgroundColor: this.backgroundColor,
            maxFramerate: this.maxFramerate,
            strokeColor: this.strokeColor,
            strokeWeight: this.strokeWeight
          }
          const p5SketchInstance = new p5Sketch(p, config, this.iterateWaveFunctionCollapse)
          p.setup = () => p5SketchInstance.setup();
          p.draw = () => p5SketchInstance.draw();
        }, this.$refs.p5canvas)
      }else{
        this.p5.setup();
      }
    },
    iterateWaveFunctionCollapse(p) {
      this.framerate = Math.round((1000 / p.deltaTime) * 10) / 10;
      if (!this.instant) {
        this.waveFunctionCollapse.iterate();
      }
      return this.waveFunctionCollapse.getCells();
    },
    resetTileset() {
      const tileset = [
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
        this.tileset.push(tileset[tilesetIndex]);
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
      for (let i = 0; i < this.tileset.length; i++) {
        let random = Math.floor(Math.random() * randomPool);
        randomPool -= random;
        random = random ? random : 1;
        randoms.push(random);
      }
      randoms = this.shuffle(randoms);
      for (let tileIndex in this.tileset) {
        this.tileset[tileIndex].weight = randoms[tileIndex];
      }
    }
  }
}
</script>
