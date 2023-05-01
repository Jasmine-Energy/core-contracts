
import { enumValues } from '@/utils/enums';

export enum EnergyCertificateType {
  REC = 'REC',
  IREC = 'IREC',
  GO = 'GO'
}

export const CertificateArr = enumValues(EnergyCertificateType);
export type CertificateType = typeof CertificateArr[number];

export enum CertificateEndorsement {
  GREEN_E = 'Green-e'
}

export const CertificateEndorsementArr = enumValues(CertificateEndorsement);
export type CertificateEndorsementType = null | typeof CertificateEndorsementArr[number];

export enum FuelType {
  SOLAR = 'SOLAR',
  WIND = 'WIND',
  GEOTHERMAL = 'GEOTHERMAL',
  HYDRO = 'HYDRO',
  OCEAN = 'OCEAN',
  BIOMASS = 'BIOMASS',
  NUCLEAR = 'NUCLEAR',
}

export const FuelTypesArray = enumValues(FuelType);
export type CertificateFuelType = typeof FuelTypesArray[number];

export enum CertificateRegistry {
  PJM_GATS = 'PJM-GATS',
  M_RETS = 'M-RETS',
  NAR = 'NAR',
  WREGIS = 'WREGIS',
  NEPOOL_GIS = 'NEPOOL-GIS',
  NC_RETS = 'NC-RETS',
  MIRECS = 'MIRECS',
  NYGATS = 'NYGATS',
  ERCOT = 'ERCOT',
  NVTRECS = 'NVTRECS',
}

export const CertificateRegistryArr = enumValues(CertificateRegistry);
export type CertificateRegistryType = typeof CertificateRegistryArr[number];

export enum CertificateStatus {
  UNMINTED = 'UNMINTED',
  MINTABLE = 'MINTABLE',
  MINTED = 'MINTED',
  DEMINTED = 'DEMINTED',
  REVOKED = 'REVOKED'
}

export const CertificateStatusArr = enumValues(CertificateStatus);
export type CertificateStatusType = typeof CertificateStatusArr[number];
