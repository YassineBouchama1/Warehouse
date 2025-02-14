import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Product } from '~/types';



export const usePrintProduct = () => {
  const generateHtml = (product: Product): string => `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="text-align: center; font-family: Arial, sans-serif;">
        <h1>${product.name}</h1>
        <p><strong>Type:</strong> ${product.type}</p>
        <p><strong>Supplier:</strong> ${product.supplier}</p>
        <p><strong>Price:</strong> ${product.price} USD</p>
        <p><strong>Barcode:</strong> ${product.barcode}</p>
        <h2>Stock Details</h2>
        <table border="1" width="100%" style="border-collapse: collapse;">
          <tr>
            <th>Warehouse</th>
            <th>Quantity</th>
          </tr>
          ${product.stocks
            .map(
              (stock) => `
              <tr>
                <td>${stock.name}</td>
                <td>${stock.quantity}</td>
              </tr>`
            )
            .join('')}
        </table>
   
      </body>
    </html>
  `;

  const printToFile = async (product: Product): Promise<void> => {
    if (!product) return;
    const { uri } = await Print.printToFileAsync({ html: generateHtml(product) });
    console.log('PDF saved at:', uri);
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  return {
    printToFile,
  };
};
