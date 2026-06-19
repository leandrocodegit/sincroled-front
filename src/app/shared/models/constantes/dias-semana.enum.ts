export enum DiaSemana {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export const DiasSemamaDescriptions: Record<DiaSemana, string> = {
  [DiaSemana.MONDAY]: 'Segunda',
  [DiaSemana.TUESDAY]: 'Terça',
  [DiaSemana.WEDNESDAY]: 'Quarta',
  [DiaSemana.THURSDAY]: 'Quinta',
  [DiaSemana.FRIDAY]: 'Sexta',
  [DiaSemana.SATURDAY]: 'Sábado',
  [DiaSemana.SUNDAY]: 'Domingo',
}

export const DiasSemamaDescriptionsCurto: Record<DiaSemana, string> = {
  [DiaSemana.MONDAY]: 'Seg',
  [DiaSemana.TUESDAY]: 'Ter',
  [DiaSemana.WEDNESDAY]: 'Qua',
  [DiaSemana.THURSDAY]: 'Qui',
  [DiaSemana.FRIDAY]: 'Sex',
  [DiaSemana.SATURDAY]: 'Sab',
  [DiaSemana.SUNDAY]: 'Dom',
}

export enum Mes {
  JANUARY = 'JANUARY',
  FEBRUARY = 'FEBRUARY',
  MARCH = 'MARCH',
  APRIL = 'APRIL',
  MAY = 'MAY',
  JUNE = 'JUNE',
  JULY = 'JULY',
  AUGUST = 'AUGUST',
  SEPTEMBER = 'SEPTEMBER',
  OCTOBER = 'OCTOBER',
  NOVEMBER = 'NOVEMBER',
  DECEMBER = 'DECEMBER',
}

export const MesDescriptions: Record<Mes, string> = {
  [Mes.JANUARY]: 'Janeiro',
  [Mes.FEBRUARY]: 'Feveiro',
  [Mes.MARCH]: 'Março',
  [Mes.APRIL]: 'Abril',
  [Mes.MAY]: 'Maio',
  [Mes.JUNE]: 'Junho',
  [Mes.JULY]: 'Julho',
  [Mes.AUGUST]: 'Agosto',
  [Mes.SEPTEMBER]: 'Setembro',
  [Mes.OCTOBER]: 'Outubro',
  [Mes.NOVEMBER]: 'Novembro',
  [Mes.DECEMBER]: 'Dezembro'
}

export const MesDescriptionsCurto: Record<Mes, string> = {
  [Mes.JANUARY]: 'Jan',
  [Mes.FEBRUARY]: 'Fev',
  [Mes.MARCH]: 'Mar',
  [Mes.APRIL]: 'Abr',
  [Mes.MAY]: 'Mai',
  [Mes.JUNE]: 'Jun',
  [Mes.JULY]: 'Jul',
  [Mes.AUGUST]: 'Ago',
  [Mes.SEPTEMBER]: 'Set',
  [Mes.OCTOBER]: 'Out',
  [Mes.NOVEMBER]: 'Nov',
  [Mes.DECEMBER]: 'Dez'
}

export const DIAS_SEMANA = [
  {
    label: DiasSemamaDescriptions[DiaSemana.MONDAY],
    value: DiaSemana.MONDAY
  },
  {
    label: DiasSemamaDescriptions[DiaSemana.TUESDAY],
    value: DiaSemana.TUESDAY
  },
  {
    label: DiasSemamaDescriptions[DiaSemana.WEDNESDAY],
    value: DiaSemana.WEDNESDAY
  },
  {
    label: DiasSemamaDescriptions[DiaSemana.THURSDAY],
    value: DiaSemana.THURSDAY
  },
  {
    label: DiasSemamaDescriptions[DiaSemana.FRIDAY],
    value: DiaSemana.FRIDAY
  },
  {
    label: DiasSemamaDescriptions[DiaSemana.SATURDAY],
    value: DiaSemana.SATURDAY
  },
  {
    label: DiasSemamaDescriptions[DiaSemana.SUNDAY],
    value: DiaSemana.SUNDAY
  },
]
