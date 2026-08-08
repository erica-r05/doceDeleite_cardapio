package com.confeitaria.doceDeleite.service;

import com.confeitaria.doceDeleite.model.Usuario;
import com.confeitaria.doceDeleite.repository.UsuarioRepository;
import org.hibernate.internal.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    public void setUsuarioRepository(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario salvar(Usuario usuario){
        if(usuario.getNome() == null){
            throw new IllegalArgumentException("Nome não pode ser vazio!");
        }
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("E-mail não pode ser vazio.");
        }

        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            throw new IllegalArgumentException("Já existe um usuário com este e-mail.");
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario atualizar(Usuario usuario){
        Usuario atualizarUsuario = usuarioRepository.findById(usuario.getId()).get();
        atualizarUsuario.setNome(usuario.getNome());
        atualizarUsuario.setSenha(usuario.getSenha());
        return usuarioRepository.save(atualizarUsuario);
    }

    public Usuario atualizarPeloEmail(String email, Usuario usuario){
        Usuario atualizarUsuario = usuarioRepository.findByEmail(email);
        atualizarUsuario.setNome(usuario.getNome());
        atualizarUsuario.setSenha(usuario.getSenha());
        return usuarioRepository.save(atualizarUsuario);
    }

    public void deletar(Usuario usuario){
        usuarioRepository.delete(usuario);
    }
}
