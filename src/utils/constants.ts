export const PROMPT_CV = '#__CV';
export const PROMPT_DESCRIPTION = '#__DESCRIPTION';
export const PROMPT_WORD_SIZE = '#__WORDS_SIZE';
export const PROMPT_BASE = `Je suis à la recherche d'un emploi voici mon cv resumé en text : #__CV . 
je veux candidater à cette offre : #__DESCRIPTION
propose une lettre de motivation qui me met en valeur pour le poste demandé en #__WORDS_SIZE mots`;
export const PROMPT_MATCH_BASE = `Je suis à la recherche d'un emploi voici mon cv resumé en text : #__CV . 
je veux candidater à cette offre : #__DESCRIPTION quels sont les points faibles de mon cv sous forme de tirets en #__WORDS_SIZE mots,
 ensuite exprime en pourcentage le match avec cette offre`;
export const CHATCV_BASE_URL = `${
	process.env.NEXT_PUBLIC_API_ROOT_URL || 'http://localhost:3000/'
}api/chatcv/`;
export const CHATCV_STORAGE_KEY = '__k';
