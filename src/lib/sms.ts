export async function sendOTP(phone: string, code: string) {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 1000));

  console.log("\n======================================");
  console.log(`🚀 [MOCK SMS] OTP for ${phone} is: ${code}`);
  console.log("======================================\n");

  return { success: true, messageId: `mock_${Date.now()}` };
}
