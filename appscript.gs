/**
 * Google Apps Script para recibir confirmaciones de asistencia (RSVP)
 * 
 * Sigue las instrucciones del archivo README.md para configurar esto.
 */

// Nombre de la hoja donde se guardarán los datos
const SHEET_NAME = "Invitados";

// Maneja las solicitudes GET (Sirve para probar si la URL está activa)
function doGet(e) {
  return ContentService.createTextOutput("El Web App está funcionando correctamente. Usa POST para enviar datos.")
    .setMimeType(ContentService.MimeType.TEXT);
}

// Maneja las solicitudes POST enviadas desde el formulario HTML
function doPost(e) {
  try {
    // 1. Obtener la hoja de cálculo activa
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    // Si la hoja no existe, la creamos y añadimos los encabezados
    if (!sheet) {
      sheet = doc.insertSheet(SHEET_NAME);
      sheet.appendRow(["Fecha", "Hora", "Nombre Completo", "Asistencia"]);
      // Congelar la primera fila y ponerla en negrita
      sheet.setFrozenRows(1);
      sheet.getRange("A1:D1").setFontWeight("bold");
    }
    
    // 2. Extraer los datos enviados desde el formulario
    // FormData en JS envía los datos en e.parameter
    const fullName = e.parameter.fullName || "Sin nombre";
    const attendance = e.parameter.attendance || "No definido";
    
    // 3. Obtener fecha y hora actuales
    const now = new Date();
    // Formato simple DD/MM/YYYY
    const dateStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "dd/MM/yyyy");
    // Formato simple HH:mm:ss
    const timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), "HH:mm:ss");
    
    // 4. Agregar la nueva fila a la hoja
    sheet.appendRow([dateStr, timeStr, fullName, attendance]);
    
    // 5. Devolver una respuesta JSON indicando éxito (y configurando CORS)
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Si hay un error, devolver JSON con el error
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
