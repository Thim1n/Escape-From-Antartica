import os
import sys

def ajouter_mysql_au_path(mysql_bin_path):
    # Récupérer la variable d'environnement 'PATH'
    path_env = os.environ.get('PATH', '')
    
    # Vérifier si le chemin MySQL est déjà dans le PATH
    if mysql_bin_path not in path_env:
        # Ajouter le chemin MySQL à la variable d'environnement 'PATH'
        new_path = path_env + os.pathsep + mysql_bin_path
        os.environ['PATH'] = new_path
        print(f"Le chemin {mysql_bin_path} a été ajouté au PATH.")
        
        # Mettre à jour le PATH dans les variables d'environnement système
        try:
            import winreg
            reg_key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Environment", 0, winreg.KEY_WRITE)
            winreg.SetValueEx(reg_key, "PATH", 0, winreg.REG_EXPAND_SZ, new_path)
            winreg.CloseKey(reg_key)
            print("Le PATH a été mis à jour dans les variables d'environnement système.")
        except Exception as e:
            print(f"Erreur lors de la mise à jour du PATH dans le registre: {e}")
    else:
        print(f"Le chemin {mysql_bin_path} est déjà présent dans le PATH.")

def main():
    # Chemin du dossier MySQL 'bin', à adapter si nécessaire
    mysql_bin_path = r"C:\Program Files\MySQL\MySQL Server 8.0\bin"  # Change selon ton installation MySQL

    # Ajouter MySQL au PATH
    ajouter_mysql_au_path(mysql_bin_path)

if __name__ == "__main__":
    main()
