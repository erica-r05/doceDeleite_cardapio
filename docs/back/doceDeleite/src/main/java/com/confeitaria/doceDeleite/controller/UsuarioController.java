package com.confeitaria.doceDeleite.controller;

import com.confeitaria.doceDeleite.model.Usuario;
import com.confeitaria.doceDeleite.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Usuario> buscarPorEmail(@RequestParam String email) {
        Usuario usuario = usuarioService.buscarPorEmail(email);
        return usuario != null
                ? ResponseEntity.ok(usuario)
                : ResponseEntity.notFound().build();
    }

    @PutMapping
    public ResponseEntity<Usuario> atualizarPorEmail(
            @RequestParam String email,
            @RequestBody Usuario usuario) {

        Usuario atualizado = usuarioService.atualizarPeloEmail(email, usuario);

        return atualizado != null
                ? ResponseEntity.ok(atualizado)
                : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioService.salvar(usuario);
        return ResponseEntity.status(201).body(novoUsuario);
    }

    @DeleteMapping
    public ResponseEntity<Usuario> deletar(@RequestBody Usuario usuario) {
        usuarioService.deletar(usuario);
        return ResponseEntity.noContent().build();
    }

}
