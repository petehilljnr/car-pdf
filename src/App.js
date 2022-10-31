import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from 'react';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import download from 'downloadjs';

function App() {

  const [ currentFile, setCurrentFile ] = useState(null);
  const [ currentText, setCurrentText ] = useState("");
  console.log(currentFile)
  const handleUpload = (e) => {
  
    const uploadedPDF = e.target.files[0];
    setCurrentFile(uploadedPDF);

  };

  const createPDF = async (pdf) => {

    const xLoc = 105;
    const yLoc = 52;
    const fontSize = 8;
    const textBoxBufferPerc = 0.05;

    const pages = pdf.computePages();
    const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica);
    const textBoxWidth = helveticaFont.widthOfTextAtSize(currentText, fontSize) ;
    const textBoxHeight = helveticaFont.sizeAtHeight(fontSize);
    
    pages.forEach(page => {
      const { width, height } = page.getSize();

      page.drawRectangle({
        x: (width - xLoc) - ((textBoxWidth * textBoxBufferPerc)),
        y: (height - yLoc) - ((textBoxHeight * textBoxBufferPerc)),
        width: textBoxWidth * (1 + (2 * textBoxBufferPerc)),
        height: textBoxHeight * (1 + (2 * textBoxBufferPerc)),
        borderWidth: 0,
        color: rgb(1, 1, 0),
        opacity: 0.5,
      })

      page.drawText(currentText, {
        x: width - xLoc,
        y: height - yLoc,
        size: fontSize,
        font: helveticaFont
      })

    });

    const pdfBytes = await pdf.save()

    download(pdfBytes, "SIGNED_" + currentFile.name, "application/pdf");
  }

  const writePDF = async (text) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(currentFile);
    reader.onload = async () => {
      await PDFDocument.load(reader.result).then(pdf => {
        createPDF(pdf)
      });      
    }
  }


  return (
    <Container>
      <h1>Dan's PDF Editor</h1>
      <hr/>
      <span>Select Existing PDF</span><br/>
      <input type="file" multiple={false} onChange={handleUpload} /><br/>
      <hr/>
      <span>Enter Number:</span>
      <input type="text" value={currentText} onChange={e=>setCurrentText(e.target.value)} /><br/>
      <hr/>
      <Button onClick={writePDF} disabled={currentFile==null}>Download</Button><br/>
      <hr/>
    </Container>
  );
}

export default App;
