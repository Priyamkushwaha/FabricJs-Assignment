import { useEffect, useState, useRef } from "react";
import "./App.css";
import { fabric } from "fabric";

function App() {
  const inputRef = useRef();
  const [canvas, setCanvas] = useState(null);
  let img=null;
  //////////////////////// initialization of canvas /////////////////////////////////////
  const initCanvas = () =>
  new fabric.Canvas("canvas", {
    height: 500,
    width: 500,
    backgroundColor: "#1F2731",
  });
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);
  ////////////////////////// image adding to canvas /////////////////////////////////////
  const handleClick = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };
  const handleChange = (e) => {
    canvas.clear();
    const reader = new FileReader();
    reader.onload = function (event) {
      const imgObj = new Image();
      imgObj.src = event.target.result;
      imgObj.onload = function () {
        const image = new fabric.Image(imgObj);
        const scale = Math.min(
          canvas.getWidth() / imgObj.width,
          canvas.getHeight() / imgObj.height
        );
        image.set({
          scaleX: scale,
          scaleY: scale,
          objectCaching: false,
          originX: "center",
          originY: "center",
          selectable: false,
          hoverCursor: 'default'
        });
        canvas.centerObject(image);
        img=image;
        canvas.add(image);
        img.viewportCenter()
        canvas.requestRenderAll();
      };
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  /////////////////////////////// adding zoom functionality /////////////////////////////////////////////////////
  canvas?.on("mouse:wheel", function (opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 1) zoom = 1;
    // accesing coordinates of viewport to calculate center
    const vptCoords = canvas.vptCoords;
    if(delta>=0){
      const centerX = (vptCoords.bl.x + vptCoords.br.x) / 2;
      const centerY = (vptCoords.bl.y + vptCoords.tl.y) / 2;
      if(zoom < 1.001){
        img.viewportCenter()
      }
      canvas.zoomToPoint({ x: centerX, y: centerY }, zoom);
    }else{
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    }
    opt.e.preventDefault();
    opt.e.stopPropagation();
    canvas.requestRenderAll();
  });

  return (
    <div className="container">
      <form action="">
        <button onClick={handleClick}>Upload</button>
        <input
          type="file"
          style={{ display: "none" }}
          name="selectedImg"
          accept="image/*"
          onChange={handleChange}
          ref={inputRef}
        />
      </form>
      <canvas id="canvas"></canvas>
    </div>
  );
}
export default App;
