import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import html2pdf from 'html2pdf.js';

const Certificate = () => {
  const { donationId } = useParams();
  const [donation, setDonation] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonationDetails();
  }, [donationId]);

  const fetchDonationDetails = async () => {
    try {
      const response = await api.get(`/donations/${donationId}`);
      setDonation(response.data.donation);
      setCampaign(response.data.campaign);
    } catch (err) {
      console.error('Error fetching donation:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('certificate-container');
    const opt = {
      margin: 0,
      filename: `OnePulse-Certificate-${donation.transactionId}.pdf`,
      image: { type: 'png', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true },
      jsPDF: { format: 'a4', orientation: 'landscape' },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading || !donation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Certificate Container - Hidden from screen but visible for PDF */}
        <div
          id="certificate-container"
          style={{
            width: '1200px',
            height: '800px',
            backgroundColor: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto 32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Background with gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%),
                radial-gradient(circle at 20% 50%, rgba(79, 172, 254, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 193, 7, 0.1) 0%, transparent 50%)
              `,
              zIndex: 0,
            }}
          ></div>

          {/* Gold Border */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '8px solid #d4af37',
              borderRadius: '4px',
              zIndex: 1,
              boxShadow: 'inset 0 0 0 2px #f0e68c, inset 0 0 20px rgba(212, 175, 55, 0.3)',
            }}
          ></div>

          {/* Content */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '60px 80px',
              textAlign: 'center',
              fontFamily: 'Georgia, serif',
              color: '#2c3e50',
            }}
          >
            {/* Top Decorative Element */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              <div style={{ fontSize: '50px' }}>🏆</div>
              <div style={{ fontSize: '50px' }}>❤️</div>
              <div style={{ fontSize: '50px' }}>🌟</div>
            </div>

            {/* Header */}
            <div>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f0e68c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '10px',
                  letterSpacing: '3px',
                }}
              >
                CERTIFICATE OF
              </div>
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '20px',
                  letterSpacing: '2px',
                }}
              >
                CONTRIBUTION
              </div>

              {/* Divider */}
              <div
                style={{
                  height: '3px',
                  width: '300px',
                  margin: '20px auto',
                  background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                }}
              ></div>
            </div>

            {/* Main Content */}
            <div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#555',
                  marginBottom: '20px',
                  letterSpacing: '1px',
                }}
              >
                This Certificate is Proudly Presented to
              </div>

              {/* Recipient Name */}
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  marginBottom: '30px',
                  textDecoration: 'underline',
                  textDecorationColor: '#d4af37',
                  textDecorationThickness: '3px',
                  textUnderlineOffset: '8px',
                }}
              >
                {donation.isAnonymous ? '🔒 Anonymous Contributor' : donation.donorName}
              </div>

              <div
                style={{
                  fontSize: '18px',
                  color: '#666',
                  marginBottom: '25px',
                  fontStyle: 'italic',
                }}
              >
                For their generous and heartfelt contribution of
              </div>

              {/* Amount */}
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f0e68c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '25px',
                  letterSpacing: '2px',
                }}
              >
                ₹{donation.amount.toLocaleString('en-IN')}
              </div>

              <div
                style={{
                  fontSize: '18px',
                  color: '#666',
                  marginBottom: '20px',
                }}
              >
                towards the noble cause of
              </div>

              {/* Campaign Title */}
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: 'bold',
                  color: '#2563eb',
                  marginBottom: '20px',
                  fontStyle: 'italic',
                  letterSpacing: '1px',
                }}
              >
                "{campaign?.title}"
              </div>

              {/* Impact Statement */}
              <div
                style={{
                  fontSize: '16px',
                  color: '#555',
                  marginTop: '20px',
                  fontStyle: 'italic',
                  maxWidth: '700px',
                  margin: '20px auto 0',
                }}
              >
                This contribution will positively impact the lives of many individuals and
                communities in need.
              </div>
            </div>

            {/* Bottom Section */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingTop: '30px',
                borderTop: '2px solid #d4af37',
              }}
            >
              {/* Left - Certificate Number */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#999',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>Certificate #:</div>
                <div>{donation.transactionId}</div>
              </div>

              {/* Center - OnePulse Logo/Text */}
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #2563eb 0%, #d4af37 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '5px',
                  }}
                >
                  OnePulse
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#999',
                    letterSpacing: '2px',
                  }}
                >
                  Making a Difference Together
                </div>
              </div>

              {/* Right - Date */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#999',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontWeight: 'bold' }}>Date:</div>
                <div>
                  {new Date(donation.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Corner Decorations */}
          <div
            style={{
              position: 'absolute',
              top: '30px',
              left: '30px',
              width: '40px',
              height: '40px',
              border: '2px solid #d4af37',
              borderRight: 'none',
              borderBottom: 'none',
              zIndex: 3,
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              width: '40px',
              height: '40px',
              border: '2px solid #d4af37',
              borderLeft: 'none',
              borderBottom: 'none',
              zIndex: 3,
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '30px',
              width: '40px',
              height: '40px',
              border: '2px solid #d4af37',
              borderRight: 'none',
              borderTop: 'none',
              zIndex: 3,
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '30px',
              width: '40px',
              height: '40px',
              border: '2px solid #d4af37',
              borderLeft: 'none',
              borderTop: 'none',
              zIndex: 3,
            }}
          ></div>
        </div>

        {/* Download Button */}
        <div className="text-center">
          <button
            onClick={downloadPDF}
            className="btn-primary px-8 py-3 text-lg font-bold"
          >
            📥 Download Certificate as PDF
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
          }
          .btn-primary {
            display: none;
          }
          #certificate-container {
            box-shadow: none;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
