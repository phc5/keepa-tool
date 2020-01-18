function formatTimePrice(array, formatPrice) {
  return (
    array &&
    array.map((data, index) => {
      if (index % 2 === 0) {
        const date = new Date((data + 21564000) * 60000);

        return date.toString();
      } else if (formatPrice && data !== -1) {
        const price = data / 100;
        return `$${price}`;
      }

      return data.toString();
    })
  );
}

function writeHeaderToCell(ws, x, y, header, style) {
  ws.cell(x, y)
    .string(header)
    .style(style);
}

function writeDataToCell(
  ws,
  style,
  dataPoint,
  firstColumnIndex,
  secondColumnIndex
) {
  dataPoint &&
    dataPoint.forEach((data, index) => {
      if (index % 2 === 0) {
        ws.cell(3 + index, firstColumnIndex)
          .string(data)
          .style(style);
      } else {
        ws.cell(3 + index - 1, secondColumnIndex)
          .string(data)
          .style(style);
      }
    });
}

module.exports = { formatTimePrice, writeHeaderToCell, writeDataToCell };
