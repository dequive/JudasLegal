import re
from typing import List, Dict
import unicodedata

class TextProcessor:
    def __init__(self):
        # Common Portuguese legal terms
        self.legal_stopwords = {
            'artigo', 'artigos', 'lei', 'leis', 'código', 'códigos',
            'parágrafo', 'parágrafos', 'inciso', 'incisos', 'alínea', 'alíneas',
            'capítulo', 'capítulos', 'secção', 'secções', 'título', 'títulos'
        }
        
        # Portuguese stopwords
        self.portuguese_stopwords = {
            'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
            'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos',
            'para', 'por', 'com', 'sem', 'sobre', 'sob', 'entre', 'até',
            'e', 'ou', 'mas', 'que', 'se', 'quando', 'onde', 'como', 'porque',
            'é', 'são', 'foi', 'foram', 'ser', 'estar', 'ter', 'haver',
            'este', 'esta', 'estes', 'estas', 'esse', 'essa', 'esses', 'essas',
            'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'isso', 'aquilo',
            'me', 'te', 'se', 'nos', 'vos', 'lhe', 'lhes', 'meu', 'minha',
            'teu', 'tua', 'seu', 'sua', 'nosso', 'nossa', 'vosso', 'vossa'
        }
    
    def preprocess_text(self, text: str) -> str:
        """
        Preprocess text for better query processing
        """
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove accents
        text = self.remove_accents(text)
        
        # Remove special characters except important punctuation
        text = re.sub(r'[^\w\s\-\.]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def remove_accents(self, text: str) -> str:
        """
        Remove accents from text
        """
        return ''.join(c for c in unicodedata.normalize('NFD', text)
                      if unicodedata.category(c) != 'Mn')
    
    def extract_keywords(self, text: str) -> List[str]:
        """
        Extract meaningful keywords from text
        """
        if not text:
            return []
        
        # Preprocess text
        processed_text = self.preprocess_text(text)
        
        # Split into words
        words = processed_text.split()
        
        # Filter out stopwords and short words
        keywords = []
        for word in words:
            if (len(word) >= 3 and 
                word not in self.portuguese_stopwords and 
                word not in self.legal_stopwords):
                keywords.append(word)
        
        return keywords
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """
        Split text into overlapping chunks
        """
        if not text:
            return []
        
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
            
            # Break if we've reached the end
            if i + chunk_size >= len(words):
                break
        
        return chunks
    
    def extract_legal_references(self, text: str) -> List[Dict[str, str]]:
        """
        Extract legal references from text (articles, laws, etc.)
        """
        references = []
        
        # Pattern for articles
        article_pattern = r'(?:artigo|art\.?)\s*(\d+(?:\.\d+)?)'
        articles = re.findall(article_pattern, text.lower())
        
        for article in articles:
            references.append({
                'type': 'article',
                'number': article,
                'text': f'Artigo {article}'
            })
        
        # Pattern for laws
        law_pattern = r'lei\s*n[º°]\s*(\d+\/\d+)'
        laws = re.findall(law_pattern, text.lower())
        
        for law in laws:
            references.append({
                'type': 'law',
                'number': law,
                'text': f'Lei nº {law}'
            })
        
        return references
    
    def format_legal_text(self, text: str) -> str:
        """
        Format legal text for better presentation
        """
        if not text:
            return ""
        
        # Add proper spacing after periods
        text = re.sub(r'\.(?=[A-Z])', '. ', text)
        
        # Format article references
        text = re.sub(r'(?:artigo|art\.?)\s*(\d+)', r'Artigo \1', text, flags=re.IGNORECASE)
        
        # Format law references
        text = re.sub(r'lei\s*n[º°]\s*(\d+\/\d+)', r'Lei nº \1', text, flags=re.IGNORECASE)
        
        return text
    
    def calculate_text_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate simple similarity between two texts
        """
        if not text1 or not text2:
            return 0.0
        
        # Get keywords from both texts
        keywords1 = set(self.extract_keywords(text1))
        keywords2 = set(self.extract_keywords(text2))
        
        if not keywords1 or not keywords2:
            return 0.0
        
        # Calculate Jaccard similarity
        intersection = len(keywords1.intersection(keywords2))
        union = len(keywords1.union(keywords2))
        
        return intersection / union if union > 0 else 0.0
