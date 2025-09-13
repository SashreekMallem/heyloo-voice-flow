// Simple document parsing utility
// In a real implementation, you might use libraries like pdf-parse or PDF.js

interface ParsedDocument {
  text: string;
  pages: number;
}

class DocumentParser {
  async parseDocument(file: File): Promise<ParsedDocument> {
    // For PDF files, we'll simulate parsing
    if (file.type === 'application/pdf') {
      return this.parsePDF(file);
    }
    
    // For text files
    if (file.type.startsWith('text/')) {
      return this.parseText(file);
    }
    
    // For other files, return empty
    return { text: '', pages: 0 };
  }

  private async parsePDF(file: File): Promise<ParsedDocument> {
    // In a real implementation, you would use a PDF parsing library
    // For now, we'll return a sample menu structure that could be parsed
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return sample parsed content
    return {
      text: `
APPETIZERS
Garlic Bread with Herbs ... $6.99
Caesar Salad with Croutons ... $8.99
Buffalo Wings (6 pieces) ... $9.99
Spinach and Artichoke Dip ... $7.99

MAIN COURSES  
Margherita Pizza ... $12.99
Pepperoni Pizza ... $14.99
Chicken Alfredo Pasta ... $15.99
Grilled Salmon with Vegetables ... $18.99
BBQ Ribs Half Rack ... $16.99

BEVERAGES
Coca Cola ... $2.99
Fresh Orange Juice ... $3.99
Coffee (Regular/Decaf) ... $2.49
Iced Tea ... $2.49

DESSERTS
Chocolate Cake ... $5.99
Tiramisu ... $6.99
Ice Cream (Vanilla/Chocolate) ... $3.99
      `.trim(),
      pages: 1
    };
  }

  private async parseText(file: File): Promise<ParsedDocument> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve({
          text,
          pages: 1
        });
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
}

export const document = new DocumentParser();