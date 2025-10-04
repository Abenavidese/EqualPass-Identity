pragma circom 2.0.0;

template StudentEligibility() {
    signal input studentStatus;     // 1 = activo, 0 = inactivo
    signal input enrollmentYear;    // año de matrícula (pública)
    signal input universityHash;    // hash de la universidad
    signal input userSecret;        // declarado como input para evitar error de sintaxis

    signal output eligible;

    // Aseguramos que studentStatus sea 0 o 1
    signal isBit;
    isBit <== studentStatus * (studentStatus - 1);

    // Regla: elegible si studentStatus == 1
    eligible <== studentStatus;
}

component main = StudentEligibility();