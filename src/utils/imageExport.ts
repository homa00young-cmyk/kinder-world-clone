import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportElementAsPNG(elementId: string, filename: string = 'kinder-world-stats.png'): Promise<boolean> {
  try {
    const el = document.getElementById(elementId);
    if (!el) return false;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return true;
  } catch (e) {
    console.error('Failed to export as PNG', e);
    return false;
  }
}

export async function exportElementAsPDF(elementId: string, filename: string = 'kinder-world-stats.pdf'): Promise<boolean> {
  try {
    const el = document.getElementById(elementId);
    if (!el) return false;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
    return true;
  } catch (e) {
    console.error('Failed to export as PDF', e);
    return false;
  }
}
