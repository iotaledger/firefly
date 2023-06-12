import { Converter } from '@core/utils'
import { ReadStream } from '@iota/util.js'
import { IParticipation } from '../interfaces'

export function parseGovernanceMetadata(metadata: string): IParticipation[] {
    if (!metadata) {
        return []
    }

    const readStream = new ReadStream(Converter.hexToBytes(metadata))

    const participations: IParticipation[] = []
    const amountParticipations = readStream.readUInt8('amountParticipations')

    for (let index = 0; index < amountParticipations; index++) {
        const eventId = Converter.bytesToHex(readStream.readBytes('eventId', 32))

        const amountAnswers = readStream.readUInt8('amountAnswers')

        const answers: number[] = []
        for (let index = 0; index < amountAnswers; index++) {
            const answer = readStream.readUInt8('answer')
            answers.push(answer)
        }

        participations.push({ eventId, answers })
    }

    return participations
}
