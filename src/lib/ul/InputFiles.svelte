<script lang="ts">

</script>

<div class="InputFile">
  <button class="InputFile_btn button">
    <label for="inputUploader">загрузить</label>
    <input id="inputUploader" type="file">
  </button>
</div>

<style lang="scss">
  .InputFile {
    &_btn {
      position: relative;
      padding: 5px 22px;
      overflow: hidden;
      cursor: pointer;
      input[type="file"]{
        width: 100%;
        height: 100%;
        left:0;
        top:0;
        opacity: 0;
        z-index: -1;
        position: absolute;
      }
      label {
        z-index: 2;
        cursor: pointer;
      }
    }
  }
</style>