export interface CardProps {
    title: string;
    description: string;
    buttonText: string;
    imageSrc: string;
    reverse?: boolean; // Si es true, la imagen estará a la izquierda
}