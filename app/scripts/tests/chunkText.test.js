import { chunkTranscript } from "../../helpers/TextFormatting";
import {test, expect} from "@jest/globals";


describe('chunkTranscript', () => {
    test('break text into paragraphs.', () => {
        const text = `0:43 - A
    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. 
    In id cursus mi pretium tellus duis convallis.

2:14 - B
  Tempus leo eu aenean sed diam urna tempor.

2:49 - A
  Pulvinar vivamus fringilla lacus nec metus bibendum egestas.

3:23 - C
  Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. 
  Ad litora torquent per conubia nostra inceptos himenaeos.

5:43 A
  Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. 
  In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla
  lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel 
  class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

7:48 - B
  Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. 
  In id cursus mi pretium tellus duis convallis. 

10:12 - C
  Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. 
  Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. 
  Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. 
  Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. 
  Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa 
  nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent 
  per conubia nostra inceptos himenaeos.

12:08 - A
  Lorem ipsum dolor sit amet.

12.30 - B
  consectetur adipiscing elit. Quisque.
`;

        const chunks = chunkTranscript(text, 1000);

        expect(chunks.length).toEqual(3);

        //chunks.forEach((c, i) => {console.log(`chunk ${i}: ${c}`)});
    });

    test('chunking a text with paragraph bigger than chunkSize.', () => {
        const text = `0:43 - A
    Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. 
    In id cursus mi pretium tellus duis convallis.

2:14 - B
  Tempus leo eu aenean sed diam urna tempor.

2:49 - A
  Pulvinar vivamus fringilla lacus nec metus bibendum egestas.

3:23 - C
  Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. 
  Ad litora torquent per conubia nostra inceptos himenaeos.

5:43 A
  Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. 
  In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla
  lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel 
  class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
  Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. 
  In id cursus mi pretium tellus duis convallis. 
  Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. 
  Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. 
  Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. 
  Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. 
  Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa 
  nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent 
  per conubia nostra inceptos himenaeos.

12:08 - A
  Lorem ipsum dolor sit amet.

12.30 - B
  consectetur adipiscing elit. Quisque.
`;

        const chunks = chunkTranscript(text, 1000);

        expect(chunks.length).toEqual(4);

        //chunks.forEach((c, i) => {console.log(`chunk ${i}: ${c}`)});
    });
});
