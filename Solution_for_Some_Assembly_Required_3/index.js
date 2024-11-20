// Constants from the data section
const DATA = {
    START_1024: [0x9d, 0x6e, 0x93, 0xc8, 0xb2, 0xb9, 0x41, 0x8b, 0x90, 0xc2, 0xdd, 0x63, 0x93, 0x93, 0x92, 0x8f, 0x64, 0x92, 0x9f, 0x94, 0xd5, 0x62, 0x91, 0xc5, 0xc0, 0x8e, 0x66, 0xc4, 0x97, 0xc0, 0x8f, 0x31, 0xc1, 0x90, 0xc4, 0x8b, 0x61, 0xc2, 0x94, 0xc9, 0x90, 0x00, 0x00],
    START_1067: [0xf1, 0xa7, 0xf0, 0x07, 0xed]
  };
  
  // Memory setup
  let memory = new Array(66864).fill(0);
  // Initialize memory with data
  DATA.START_1024.forEach((value, index) => {
    memory[1024 + index] = value;
  });
  DATA.START_1067.forEach((value, index) => {
    memory[1067 + index] = value;
  });
  
  // Helper function to get signed byte value
  function signedByte(value) {
    return value << 24 >> 24;
  }
  
  function strcmp(ptr1, ptr2) {
    let c1, c2;
    do {
      c1 = memory[ptr1++];
      c2 = memory[ptr2++];
      if (c1 === 0) {
        return c1 - c2;
      }
    } while (c1 === c2);
    return c1 - c2;
  }
  
  function check_flag() {
    const result = strcmp(1072, 1024);
    return (result !== 0) ^ -1 & 1;
  }
  
  function copy_char(char, index) {
    if (char !== 0) {
      const keyIndex = (4 - (index % 5));
      const keyByte = signedByte(memory[1067 + keyIndex]);
      char = char ^ keyByte;
    }
    memory[1072 + index] = char;
  }
  
  // Export the functions and memory
  module.exports = {
    strcmp,
    check_flag,
    copy_char,
    memory,
    // Export memory locations used in original WASM
    memoryLocations: {
      input: 1072,
      key: 1067,
      dso_handle: 1024,
      data_end: 1328,
      global_base: 1024,
      heap_base: 66864,
      memory_base: 0,
      table_base: 1
    }
  };

  function decode() {
    const target = [0x9d, 0x6e, 0x93, 0xc8, 0xb2, 0xb9, 0x41, 0x8b, 0x90, 0xc2, 0xdd, 0x63, 0x93, 0x93, 0x92, 0x8f, 0x64, 0x92, 0x9f, 0x94, 0xd5, 0x62, 0x91, 0xc5, 0xc0, 0x8e, 0x66, 0xc4, 0x97, 0xc0, 0x8f, 0x31, 0xc1, 0x90, 0xc4, 0x8b, 0x61, 0xc2, 0x94, 0xc9, 0x90];
    const key = [0xf1, 0xa7, 0xf0, 0x07, 0xed];
    
    let flag = '';
    
    // Với mỗi byte trong target string
    for(let i = 0; i < target.length; i++) {
      // Lấy byte tương ứng từ key (chu kỳ 5 bytes)
      const keyByte = key[4 - (i % 5)];
      
      // XOR ngược lại để có được ký tự gốc
      const originalChar = target[i] ^ keyByte;
      
      // Chuyển số thành ký tự
      flag += String.fromCharCode(originalChar);
    }
    
    return flag;
  }
  
  console.log("Flag:", decode());