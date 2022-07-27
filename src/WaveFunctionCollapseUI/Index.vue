<template>
  <div>
    <h1>Wave Function Collapse</h1>
    <label for="resolutionWidthInput" class="form-label">Resolution width (px)</label>
    <input v-model="resolutionWidth" class="form-range" type="range" min="1" :max="maxResolutionWidth">
    <input v-model="resolutionWidth" id="resolutionWidthInput" type="number" min="1">
    <label for="resolutionHeightInput" class="form-label">Resolution height (px)</label>
    <input v-model="resolutionHeight" class="form-range" type="range" min="1" :max="maxResolutionHeight">
    <input v-model="resolutionHeight" id="resolutionHeightInput" type="number" min="1">
    <p v-if="resolutionWidth > maxResolutionWidth || resolutionHeight > maxResolutionHeight">
      Careful //@todo
    </p>
    <a class="btn btn-primary" href="#" role="button" @click="handleGenerate">
      Generate
    </a>
  </div>
</template>

<script>
export default {
  name: "Index",
  data: () => (
      {
        maxResolutionWidth: 1000,
        maxResolutionHeight: 1000,
        resolutionWidth: 100,
        resolutionHeight: 100,
        maxGridColumns: 200,
        maxGridRows: 200,
        gridColumns: 200,
        gridRows: 200,
        backgroundColor: '#fff',
        strokeColor: '#000',
        strokeWidth: 1,
        instant: false,
        maxFramerate: 140,
      }
  ),
  methods: {
    handleGenerate () {

    }
  }
}
</script>
