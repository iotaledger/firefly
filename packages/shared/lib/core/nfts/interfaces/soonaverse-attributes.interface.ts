import { ISoonaverseAttribute } from './soonaverse-attribute.interface'

export interface ISoonaverseAttributes {
    props: Record<string, ISoonaverseAttribute>
    stats: Record<string, ISoonaverseAttribute>
}
