"use client";

import React, { useState } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Dialog, DialogTitle, DialogContent, Box, InputBase, IconButton, Menu, MenuItem
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const scanData = [
  { id: 1, name: "Chest scan", date: "2024-03-20", image: "/scan1.jpg" },
  { id: 2, name: "X-Ray", date: "2024-03-15", image: "/scan2.jpg" },
  { id: 3, name: "Scan", date: "2024-02-10", image: "/scan3.jpg" }
];

const ScanResultsPage = () => {
  const [open, setOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [menuAnchor, setMenuAnchor] = useState(null);
  const router = useRouter();

  const handleView = (scan) => {
    setSelectedScan(scan);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedScan(null);
  };

  const handleDownload = (image) => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "scan_result.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleSort = (order) => {
    setSortOrder(order);
    handleMenuClose();
  };

  const handleImageClick = () => {
    setZoomOpen(true);
  };

  const handleZoomClose = () => {
    setZoomOpen(false);
  };

  const filteredScans = scanData
    .filter((scan) => scan.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortOrder === "asc" 
      ? new Date(a.date) - new Date(b.date) 
      : new Date(b.date) - new Date(a.date)
    );

  return (
    <Box sx={{ p: 4, overflowY: "auto", maxHeight: "80vh" }}> 
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <h2 style={{ textAlign: "center", color: "hsl(210, 60%, 40%)", fontSize: "24px", fontWeight: "bold" }}>
          Scan Results
        </h2>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Box sx={{ 
          position: "relative", width: 800, border: "1px solid #ccc", borderRadius: "8px",
          backgroundColor: "hsl(150, 50%, 90%)", display: "flex", alignItems: "center", px: 2,
          "&:focus-within": { backgroundColor: "hsl(210, 60%, 98%)" } 
        }}>
          <MagnifyingGlassIcon style={{ width: 20, height: 20, color: "#666", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          
          <InputBase
            placeholder="Rechercher un scan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, py: 1, pl: 5, pr: 4, borderRadius: "8px", fontSize: 14 }}
          />
          
          <IconButton onClick={handleMenuOpen} sx={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
            <AdjustmentsHorizontalIcon style={{ width: 24, height: 24, color: "#333" }} />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleSort("asc")}>Sort by date (Old → Recent)</MenuItem>
            <MenuItem onClick={() => handleSort("desc")}>Sort by date (Recent → Old)</MenuItem>
          </Menu>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: "8px", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Scan Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredScans.map((scan) => (
              <TableRow key={scan.id}> 
                <TableCell>{scan.name}</TableCell>
                <TableCell>{scan.date}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="contained" sx={{ backgroundColor: "hsl(210, 60%, 80%)", color: "white" }} onClick={() => handleView(scan)}>
                      See
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: "hsl(150, 50%, 60%)", color: "white" }} onClick={() => handleDownload(scan.image)}>
                      Download
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Modal pour afficher le scan */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedScan?.name}</DialogTitle>
        <DialogContent>
          {selectedScan && (
            <Box sx={{ textAlign: "center" }}>
              <img 
                src={selectedScan.image} 
                alt={selectedScan.name} 
                style={{ width: "100%", height: "300%" , borderRadius: "8px", cursor: "pointer" }} 
                onClick={handleImageClick}
              />
              <p style={{ marginTop: "10px", fontWeight: "bold" }}>Date: {selectedScan.date}</p>
              <Button onClick={handleClose} sx={{ mt: 2, backgroundColor: "hsl(210, 60%, 40%)", color: "white" }}>
                Close
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Zoom plein écran */}
      <Dialog open={zoomOpen} onClose={handleZoomClose} fullScreen>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img 
            src={selectedScan?.image} 
            alt="Zoomed Scan" 
            style={{ maxWidth: "100vw", maxHeight: "100vh" }} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ScanResultsPage;
