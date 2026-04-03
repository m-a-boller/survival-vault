from fpdf import FPDF
from datetime import datetime
from typing import List
from app.models import Location, Box, Item, Shelter
from datetime import date

class InventoryReport(FPDF):
    def header(self) -> None:
        self.set_font('helvetica', 'B', 16)
        self.cell(0, 10, 'SURVIVAL VAULT - EMERGENCY LEDGER', border=0, new_x="LMARGIN", new_y="NEXT", align='C')
        self.set_font('helvetica', 'I', 10)
        self.cell(0, 10, f'Export Date: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}', border=0, new_x="LMARGIN", new_y="NEXT", align='C')
        self.ln(10)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', border=0, align='C')

def generate_inventory_pdf(locations: List[Location], shelters: List[Shelter]) -> bytes:
    pdf = InventoryReport()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    today = date.today()

    # --- 1. INVENTORY SECTION ---
    pdf.set_font('helvetica', 'B', 16)
    pdf.cell(0, 10, 'I. INVENTORY OVERVIEW', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    for loc in locations:
        pdf.set_font('helvetica', 'B', 14)
        pdf.set_fill_color(240, 240, 240)
        pdf.cell(0, 10, f'LOCATION: {loc.name}', border=1, new_x="LMARGIN", new_y="NEXT", fill=True)
        pdf.set_font('helvetica', '', 10)
        if loc.description:
            pdf.cell(0, 8, f'Description: {loc.description}', new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

        for box in loc.boxes:
            pdf.set_font('helvetica', 'B', 12)
            pdf.cell(0, 8, f'Box: {box.number} (UUID: {box.uuid})', border='B', new_x="LMARGIN", new_y="NEXT")
            
            pdf.set_font('helvetica', 'B', 10)
            pdf.cell(80, 8, 'Item Name', border=1)
            pdf.cell(30, 8, 'Quantity', border=1)
            pdf.cell(40, 8, 'Expiry Date', border=1)
            pdf.cell(40, 8, 'Status', border=1, new_x="LMARGIN", new_y="NEXT")

            pdf.set_font('helvetica', '', 10)
            for item in box.items:
                is_critical = item.quantity < item.min_quantity
                is_expired = item.expiry_date and item.expiry_date <= today
                
                status_str = "OK"
                if is_critical or is_expired:
                    pdf.set_font('helvetica', 'B', 10)
                    status_str = "[!] CRITICAL" if is_critical else "[!] EXPIRED"
                else:
                    pdf.set_font('helvetica', '', 10)

                pdf.cell(80, 8, f'{item.name}', border=1)
                pdf.cell(30, 8, f'{item.quantity} {item.unit}', border=1)
                pdf.cell(40, 8, f'{item.expiry_date or "N/A"}', border=1)
                pdf.cell(40, 8, status_str, border=1, new_x="LMARGIN", new_y="NEXT")
            
            pdf.ln(5)
        pdf.ln(5)

    # --- 2. SHELTER SECTION ---
    pdf.add_page()
    pdf.set_font('helvetica', 'B', 16)
    pdf.cell(0, 10, 'II. SHELTER MAPPING', new_x="LMARGIN", new_y="NEXT")
    pdf.ln(5)

    for s in shelters:
        pdf.set_font('helvetica', 'B', 14)
        pdf.set_fill_color(230, 230, 255)
        pdf.cell(0, 10, f'SHELTER: {s.name}', border=1, new_x="LMARGIN", new_y="NEXT", fill=True)
        
        pdf.set_font('helvetica', 'B', 10)
        pdf.cell(40, 8, 'Type:', border=0)
        pdf.set_font('helvetica', '', 10)
        pdf.cell(0, 8, f'{s.type}', new_x="LMARGIN", new_y="NEXT")

        pdf.set_font('helvetica', 'B', 10)
        pdf.cell(40, 8, 'Coordinates:', border=0)
        pdf.set_font('helvetica', '', 10)
        pdf.cell(0, 8, f'LAT: {s.lat}, LNG: {s.lng}', new_x="LMARGIN", new_y="NEXT")

        pdf.set_font('helvetica', 'B', 10)
        pdf.cell(40, 8, 'Capacity:', border=0)
        pdf.set_font('helvetica', '', 10)
        pdf.cell(0, 8, f'{s.capacity} Person(s)', new_x="LMARGIN", new_y="NEXT")

        pdf.set_font('helvetica', 'B', 10)
        pdf.cell(40, 8, 'Resources:', border=0)
        pdf.set_font('helvetica', '', 10)
        res = []
        if s.water_source:
            res.append("Water Source")
        if s.heat_source:
            res.append("Heat Source")
        pdf.cell(0, 8, ", ".join(res) if res else "None", new_x="LMARGIN", new_y="NEXT")

        if s.notes:
            pdf.ln(2)
            pdf.set_font('helvetica', 'B', 10)
            pdf.cell(0, 8, 'Notes:', new_x="LMARGIN", new_y="NEXT")
            pdf.set_font('helvetica', '', 10)
            pdf.multi_cell(0, 6, str(s.notes), border=1)
        
        pdf.ln(10)

    output: bytes = pdf.output()
    return output
