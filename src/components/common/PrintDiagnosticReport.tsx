import React, { useRef } from 'react';
import { AssessmentSubmission, Assessment } from '../../types';
import { Modal } from './Modal';
import { Button } from './Button';
import { Printer, Download, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PrintDiagnosticReportProps {
  isOpen: boolean;
  onClose: () => void;
  submission: AssessmentSubmission;
  assessment?: Assessment | null;
}

export const PrintDiagnosticReport: React.FC<PrintDiagnosticReportProps> = ({
  isOpen,
  onClose,
  submission,
  assessment
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pratinjau Lembar Laporan Diagnostik Resmi"
      subtitle="Siap dicetak atau diekspor ke format dokumen PDF"
      size="lg"
      footer={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="primary" size="sm" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Cetak / Simpan PDF
          </Button>
        </div>
      }
    >
      <div 
        ref={reportRef} 
        className="p-6 bg-white border border-slate-300 rounded-lg text-slate-900 font-sans print:border-none print:p-0 print:m-0"
      >
        {/* Kop Surat Resmi */}
        <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
          <h4 className="text-xs font-bold tracking-widest uppercase">PEMERINTAH KABUPATEN MUKOMUKO</h4>
          <h3 className="text-sm font-extrabold tracking-wider uppercase">DINAS PENDIDIKAN DAN KEBUDAYAAN</h3>
          <p className="text-[10px] text-slate-600">
            Sistem Informasi Pembelajaran Terpadu 3T — JALIN BELAJAR (Jejaring Literasi & Numerasi Data)
          </p>
          <p className="text-[10px] text-slate-500">Kompleks Perkantoran Pemkab Mukomuko, Provinsi Bengkulu 38365</p>
        </div>

        <div className="text-center my-3">
          <h2 className="text-sm font-black underline uppercase">LAPORAN HASIL ASESMEN DIAGNOSTIK SISWA</h2>
          <p className="text-[11px] text-slate-500 font-mono">No. Dokumen: JALIN/DIAG/{submission.id.toUpperCase()}</p>
        </div>

        {/* Identitas Peserta Didik */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
          <div>
            <p className="text-slate-500">Nama Peserta Didik:</p>
            <p className="font-bold text-slate-900">{submission.studentName}</p>
          </div>
          <div>
            <p className="text-slate-500">Satuan Pendidikan:</p>
            <p className="font-bold text-slate-900">{submission.schoolId === 'sch-01' ? 'SDN 05 Air Rami (3T Pesisir)' : 'Satuan Pendidikan Binaan'}</p>
          </div>
          <div>
            <p className="text-slate-500">Paket Asesmen:</p>
            <p className="font-semibold text-slate-800">{assessment?.title || 'Asesmen Numerasi & Literasi Dasar'}</p>
          </div>
          <div>
            <p className="text-slate-500">Waktu Penyelesaian:</p>
            <p className="font-semibold text-slate-800">{new Date(submission.submittedAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
          </div>
        </div>

        {/* Skor Rekap */}
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs mb-4">
          <div>
            <span className="text-slate-600 font-medium">Skor Capaian Diagnostik:</span>
            <span className="text-lg font-black text-blue-800 ml-2">{submission.score} / 100</span>
          </div>
          <div>
            <span className="text-slate-600 font-medium">Ketuntasan Butir:</span>
            <span className="font-bold text-slate-900 ml-1.5">{submission.correctCount} dari {submission.totalQuestions} Soal Benar</span>
          </div>
          <div>
            <span className={`font-bold px-2.5 py-1 rounded-full text-[11px] ${
              submission.score >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {submission.score >= 70 ? 'TUNTAS KOMPETENSI' : 'PERLU PENGUATAN'}
            </span>
          </div>
        </div>

        {/* Tabel Analisis Kompetensi */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase mb-2">Matriks Penguasaan Kompetensi Dasar:</h4>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300">No</th>
                <th className="p-2 border-r border-slate-300">Kompetensi yang Dinilai</th>
                <th className="p-2 border-r border-slate-300 text-center">Persentase</th>
                <th className="p-2 text-center">Kategori Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {submission.competencyMastery.map((comp, idx) => (
                <tr key={comp.competencyId}>
                  <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-300 font-medium">{comp.competencyName}</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold">{comp.percentage}%</td>
                  <td className="p-2 text-center">
                    <span className={`font-semibold ${comp.isMastered ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {comp.isMastered ? 'Tuntas' : 'Perlu Penguatan'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tindak Lanjut Pedagogik */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-6">
          <p className="font-bold text-slate-800 mb-1">Rekomendasi Tindak Lanjut Pedagogik (JALIN-TUNTAS):</p>
          <p className="text-slate-600 leading-relaxed">
            {submission.score >= 70
              ? 'Peserta didik telah memenuhi kriteria ketuntasan kompetensi minimum (KKTP). Disarankan mempelajari modul pengayaan literasi dan penalaran kontekstual mandiri.'
              : 'Peserta didik memerlukan pendampingan remedial pada operasi penjumlahan/pengurangan pecahan dasar menggunakan alat peraga konkret atau modul interaktif JALIN-TUNTAS.'}
          </p>
        </div>

        {/* Tanda Tangan */}
        <div className="grid grid-cols-2 text-center text-xs pt-4 border-t border-slate-200 mt-6">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold text-slate-800">Kepala Satuan Pendidikan</p>
            <div className="h-14 flex items-center justify-center text-slate-300 text-[10px] italic">
              [Tanda Tangan & Cap Digital]
            </div>
            <p className="font-bold text-slate-900 underline">Sri Wahyuni, S.Pd., M.M.</p>
            <p className="text-[10px] text-slate-500">NIP. 19760520 200212 2 001</p>
          </div>

          <div>
            <p className="text-slate-500">Mukomuko, {new Date().toLocaleDateString('id-ID')}</p>
            <p className="font-bold text-slate-800">Guru Kelas / Wali Kelas</p>
            <div className="h-14 flex items-center justify-center text-slate-300 text-[10px] italic">
              [Tanda Tangan Digital]
            </div>
            <p className="font-bold text-slate-900 underline">Siti Rahmawati, S.Pd.</p>
            <p className="text-[10px] text-slate-500">NIP. 19920410 201802 2 003</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

