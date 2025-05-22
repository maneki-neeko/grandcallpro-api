import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Configuração
const API_URL = process.env.API_URL || 'http://localhost:8081';
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'call_data.json');
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || '30000', 10); // 30 segundos

// Interface para os dados de chamada
interface CallData {
  AcctId: string;
  accountcode: string;
  src: string;
  dst: string;
  dcontext: string;
  clid: string;
  channel: string;
  dstchannel: string;
  lastapp: string;
  lastdata: string;
  start: string;
  answer: string;
  end: string;
  duration: string;
  billsec: string;
  disposition: string;
  amaflags: string;
  uniqueid: string;
  userfield: string;
  channel_ext: string;
  dstchannel_ext: string;
  service: string;
  caller_name: string;
  recordfiles: string;
  dstanswer: string;
  chanext: string;
  dstchanext: string;
  session: string;
  action_owner: string;
  action_type: string;
  src_trunk_name: string;
  dst_trunk_name: string;
  sn: string;
}

/**
 * Ler dados do arquivo JSON
 */
function readCallData(): CallData[] {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Erro ao ler arquivo ${DATA_FILE}:`, error.message);
    return [];
  }
}

/**
 * Enviar um registro de chamada para a API
 */
async function sendCallData(callData: CallData): Promise<void> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    await axios.post(`${API_URL}/core/data`, callData, { headers });
    console.log(`✅ Dados enviados com sucesso: ${callData.uniqueid} (AcctId: ${callData.AcctId})`);
  } catch (error) {
    console.error(`❌ Erro ao enviar dados ${callData.uniqueid} (AcctId: ${callData.AcctId}):`, error.message);
    console.log(error)
  }
}

/**
 * Função principal que executa o envio de dados em intervalos
 */
async function main() {
  console.log('🚀 Iniciando serviço de envio de dados de chamadas');
  console.log(`📁 Arquivo de dados: ${DATA_FILE}`);
  console.log(`🔗 API URL: ${API_URL}`);

  // Ler os dados do arquivo
  const callDataArray = readCallData();
  
  if (callDataArray.length === 0) {
    console.error('❌ Nenhum dado de chamada encontrado no arquivo.');
    process.exit(1);
  }
  
  console.log(`📊 ${callDataArray.length} registros de chamada carregados`);

  let currentIndex = 0;

  // Função para enviar o próximo registro
  const sendNext = async () => {
    const callData = callDataArray[currentIndex];
    await sendCallData(callData);
    
    // Avança para o próximo registro, voltando ao início se chegar ao fim
    currentIndex = (currentIndex + 1) % callDataArray.length;
  };

  // Envia o primeiro registro imediatamente
  await sendNext();
  
  // Configura o intervalo para enviar os próximos registros
  setInterval(sendNext, INTERVAL_MS);
  
  console.log(`⏱️ Enviando dados a cada ${INTERVAL_MS / 1000} segundos`);
}

// Executa a função principal
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
