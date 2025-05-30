
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Award, Users, FileText, Settings, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import { certificateService } from "@/services/certificateService";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user } = useAuth();
  const { notifications } = useNotifications();

  // Fetch dashboard statistics
  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ['customers', 1, 5, ''],
    queryFn: () => customerService.getAll(1, 5, ''),
  });

  const { data: certificatesData, isLoading: certificatesLoading } = useQuery({
    queryKey: ['certificates', 1, 5, ''],
    queryFn: () => certificateService.getAll(1, 5, ''),
  });

  const { data: recentTurkAkCustomers } = useQuery({
    queryKey: ['customers', 'recent-turkak'],
    queryFn: customerService.getRecentTurkAk,
  });

  const stats = {
    customerCount: customersData?.totalCount || 0,
    certificateCount: certificatesData?.totalCount || 0,
    deviceCount: 16, // This would come from device service
    referenceDeviceCount: 9, // This would come from reference device service
  };

  const recentCustomers = customersData?.data || [];
  const recentCertificates = certificatesData?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hoş Geldiniz, {user?.fullName}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Müşteri</p>
              {customersLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{stats.customerCount}</p>
              )}
            </div>
            <div className="rounded-full p-3 bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Sertifika</p>
              {certificatesLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold">{stats.certificateCount}</p>
              )}
            </div>
            <div className="rounded-full p-3 bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cihaz Türleri</p>
              <p className="text-3xl font-bold">{stats.deviceCount}</p>
            </div>
            <div className="rounded-full p-3 bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Referans Cihazlar</p>
              <p className="text-3xl font-bold">{stats.referenceDeviceCount}</p>
            </div>
            <div className="rounded-full p-3 bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Kalibrasyon Uyarıları
            </CardTitle>
            <CardDescription>
              Kalibrasyon süresi yaklaşan cihazlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <ul className="space-y-3">
                {notifications.map((notification) => (
                  <li key={notification.id} className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                    <p className="font-medium">{notification.deviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message} ({notification.daysLeft} gün kaldı)
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Kalibrasyon uyarısı bulunmamaktadır.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <div className="space-y-6">
          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <CardTitle>Son Eklenen Müşteriler</CardTitle>
              <CardDescription>
                Son eklenen müşteriler
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customersLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <ul className="space-y-2">
                    {recentCustomers.map((customer) => (
                      <li key={customer.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                        <span>{customer.companyName}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-right">
                    <Link to="/musteri-listesi" className="text-sm text-primary hover:underline">
                      Tüm müşterileri görüntüle
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Certificates */}
          <Card>
            <CardHeader>
              <CardTitle>Son Sertifikalar</CardTitle>
              <CardDescription>
                Son oluşturulan kalibrasyon sertifikaları
              </CardDescription>
            </CardHeader>
            <CardContent>
              {certificatesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <ul className="space-y-2">
                    {recentCertificates.map((cert) => (
                      <li key={cert.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                        <div>
                          <p>{cert.customerName}</p>
                          <p className="text-sm text-muted-foreground">{cert.deviceType}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(cert.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-right">
                    <Link to="/tum-sertifikalar" className="text-sm text-primary hover:underline">
                      Tüm sertifikaları görüntüle
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
