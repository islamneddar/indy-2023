# Test de développement logiciel

Ce test de développement logiciel a été réalisé dans un délai de 4 heures. Cependant, en raison de la complexité du projet, j'ai ajouté 2 à 3 heures de travail supplémentaires pour terminer certains tests. Pour clarifier la progression, j'ai ajouté des commits marquant l'état du projet après les 4 premières heures. Après ces 4 heures, j'avais atteint le niveau d'achèvement attendu, mais j'ai estimé qu'il était essentiel d'ajouter des tests pour garantir la qualité du code.

## Réflexion sur le projet

Pour résoudre ce test, j'ai choisi d'utiliser une structure de données en arbre (tree) pour valider les différentes contraintes de promo code, notamment les contraintes liées à l'âge, à la date et aux données météorologiques.

L'arbre est construit en utilisant des nœuds représentant différentes contraintes, telles que l'âge ou la date. Ces contraintes sont organisées hiérarchiquement à l'aide des nœuds `@or` et `@and`. Chaque nœud peut avoir plusieurs enfants, ce qui permet de représenter des combinaisons complexes de contraintes.

                    @and (F)
                   /  \
              @age (T)  @and (F)
                        /   \
                        @date(T)  weather(F)


Le process de validation commence de bas en haut (bottomUp) comme dans les arbre de descision donc chaque niveau (k) permet de donner le resultat de niveau (k-1) et ainsi de suite jusqu'au niveau 0 qui est le resultat final.

## Améliorations possibles

Si j'avais eu plus de temps, voici quelques améliorations que j'aurais apportées au test :

1. **Tests End-to-End (E2E)** : J'aurais ajouté des tests E2E pour évaluer le système dans son ensemble. Cela permettrait de s'assurer que tous les composants fonctionnent correctement ensemble.

2. **Révision de la structure de données** : J'aurais exploré la possibilité d'utiliser une structure de données différente, en fonction des besoins futurs du projet. J'aurais vérifié si l'arbre est la meilleure structure pour garantir la maintenabilité et la scalabilité.

3. **Amélioration de la gestion des erreurs** : La gestion des erreurs pourrait être améliorée. Je réfléchirais à une méthode plus efficace pour retourner les raisons d'erreur, de manière plus structurée et conviviale.

4. **Validation des champs de création de code promo** : J'aurais revu la validation des champs pour garantir la cohérence des interfaces et des contraintes de création de code promo.


## Collection Postman

je partage avec vous une collection postman ou y avait touts les requetes pour tester l'api :
https://martian-crescent-733923.postman.co/workspace/inoomify~39cbfe12-25d6-499f-aae3-8143345eac2a/folder/25732222-d3d0a7a0-e16e-4402-b128-ac70cc80ee06?action=share&creator=25732222&ctx=documentation&active-environment=25732222-9e57f555-8ece-460c-9ed4-cba1a163306f