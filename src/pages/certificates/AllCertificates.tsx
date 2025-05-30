
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CertificatesTable from "./components/CertificatesTable";
import QRCodeDialog from "./components/QRCodeDialog";
import { useCertificates, useGenerateQR } from "@/hooks/useCertificates";
import { useState } from "react";
import { QRCodeData } from "./types/certificate.types";

const AllCertificates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesCount, setEntriesCount] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [currentQRCode, setCurrentQRCode] = useState<QRCodeData>({ 
    certificateId: "", 
    qrImageUrl: null 
  });

  const pageSize = parseInt(entriesCount);
  
  const { data: certificatesData, isLoading, error } = useCertificates(
    currentPage, 
    pageSize, 
    searchTerm
  );

  const generateQRMutation = useGenerateQR();

  const handleGenerateQR = async (certificateId: string) => {
    try {
      const result = await generateQRMutation.mutateAsync(certificateId);
      setCurrentQRCode({
        certificateId,
        qrImageUrl: result.qrImageUrl
      });
      setIsQRDialogOpen(true);
    } catch (error) {
      console.error('QR kod oluşturulurken hata:', error);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEntriesChange = (value: string) => {
    setEntriesCount(value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Son Kalibrasyon Sertifikaları</h1>
          <Button asChild className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
            <Link to="/musteri-listesi">
              <ArrowLeft className="h-4 w-4" />
              Müşteri Listesine Dön
            </Link>
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Sertifikalar yüklenirken hata oluştu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Son Kalibrasyon Sertifikaları</h1>
        
        <Button
          asChild
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <Link to="/musteri-listesi">
            <ArrowLeft className="h-4 w-4" />
            Müşteri Listesine Dön
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Show</span>
          <Select value={entriesCount} onValueChange={handleEntriesChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">Entries</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Search:</span>
          <Input 
            type="search" 
            placeholder="Ara..." 
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="max-w-[250px]"
          />
        </div>
      </div>
      
      <CertificatesTable 
        certificates={certificatesData?.data || []}
        onGenerateQR={handleGenerateQR}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {certificatesData && certificatesData.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Önceki
          </Button>
          <span className="px-4 py-2 text-sm">
            Sayfa {currentPage} / {certificatesData.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(certificatesData.totalPages, prev + 1))}
            disabled={currentPage === certificatesData.totalPages}
          >
            Sonraki
          </Button>
        </div>
      )}
      
      <QRCodeDialog 
        isOpen={isQRDialogOpen}
        onOpenChange={setIsQRDialogOpen}
        qrCodeData={currentQRCode}
      />
    </div>
  );
};

export default AllCertificates;
