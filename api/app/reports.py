from fpdf import FPDF
from datetime import datetime
from typing import List
from app.models import Location, Box, Item
from datetime import date

class InventoryReport(FPDF):
    def header(self):
        self.set_font('helvetica', 'B', 16)
        self.cell(0, 10, 'SURVIVAL VAULT - EMERGENCY LEDGER', border=False, ln=True, align='C')
        self.set_font('helvetica', 'I', 10)
        self.cell(0, 10, f'Export Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', border=False, ln=True, align='C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', border=False, align='C')

def generate_inventory_pdf(locations: List[Location]) -> bytes:
    pdf = InventoryReport()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    today = date.today()

    for loc in locations:
        # Location Header
        pdf.set_font('helvetica', 'B', 14)
        pdf.set_fill_color(240, 240, 240)
        pdf.cell(0, 10, f'LOCATION: {loc.name}', border=1, ln=True, fill=True)
        pdf.set_font('helvetica', '', 10)
        if loc.description:
            pdf.cell(0, 8, f'Description: {loc.description}', ln=True)
        pdf.ln(2)

        for box in loc.boxes:
            # Box Header
            pdf.set_font('helvetica', 'B', 12)
            pdf.cell(0, 8, f'Box: {box.number} (UUID: {box.uuid})', border='B', ln=True)
            
            # Item Table Header
            pdf.set_font('helvetica', 'B', 10)
            pdf.cell(80, 8, 'Item Name', border=1)
            pdf.cell(30, 8, 'Quantity', border=1)
            pdf.cell(40, 8, 'Expiry Date', border=1)
            pdf.cell(40, 8, 'Status', border=1, ln=True)

            pdf.set_font('helvetica', '', 10)
            for item in box.items:
                is_critical = item.quantity < item.min_quantity
                is_expired = item.expiry_date and item.expiry_date <= today
                
                status_str = ""
                if is_critical or is_expired:
                    pdf.set_font('helvetica', 'B', 10)
                    status_str = "[!] CRITICAL" if is_critical else "[!] EXPIRED"
                else:
                    pdf.set_font('helvetica', '', 10)
                    status_str = "OK"

                pdf.cell(80, 8, f'{item.name}', border=1)
                pdf.cell(30, 8, f'{item.quantity} {item.unit}', border=1)
                pdf.cell(40, 8, f'{item.expiry_date or "N/A"}', border=1)
                pdf.cell(40, 8, status_str, border=1, ln=True)
            
            pdf.ln(5)
        pdf.ln(10)

    return pdf.output()
