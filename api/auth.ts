// Tipe ini mendefinisikan struktur data yang diharapkan dari form login dan register.
// Ini menggantikan `unknown` untuk memberikan type safety.
export interface LoginData {
  email: string;
  password?: string; // Password bisa opsional jika menggunakan provider OAuth
}

export interface RegisterData extends LoginData {
  name: string;
}
export interface AuthResult {
  success: boolean;
  error?: string;
}

export const loginUser = async (data: LoginData): Promise<AuthResult> => {
  console.log("Login data:", data);
  // Simulasi API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Dalam aplikasi nyata, di sini Anda akan memanggil API backend Anda
  // dan mengembalikan hasilnya.
  // Contoh: const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify(data) });
  // const result = await response.json();
  return { success: true };
};

export const registerUser = async (data: RegisterData): Promise<AuthResult> => {
  console.log("Register data:", data);
  // Simulasi API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Sama seperti login, di sini Anda akan memanggil API registrasi.
  return { success: true };
};